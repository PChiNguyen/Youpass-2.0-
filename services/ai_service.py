import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel
from core.exceptions import ThirdPartyServiceError

# 🟢 1. Tạo model con thay thế cho dict tự do (hoặc dùng list[str])
class PayloadDetail(BaseModel):
    field_name: str
    description: str

class AIExplanationSchema(BaseModel):
    summary: str
    suggested_fix: str     
    # 🟢 2. Thay 'payload_data: dict' bằng 'list[PayloadDetail]' hoặc 'list[str]'
    payload_details: list[PayloadDetail]


class AIService:
    # Tuple of legitimate, official Gemini Flash models ordered by speed and capability
    FALLBACK_MODELS = ("lyria-realtime-exp")     

    def __init__(self):
        # 🟢 Switch configuration file based on TESTING environment variable
        env_file = ".env.test" if os.getenv("TESTING") == "1" else ".env"
        load_dotenv(dotenv_path=env_file, override=True)    

        api_key = os.getenv("GEMINI_API_KEY")      

        if not api_key:
            raise ThirdPartyServiceError(
                message="Gemini API key is missing from environment variables."
            )   

        self.client = genai.Client(api_key=api_key)

    def generate_smart_error_payload(self, error_context: str) -> AIExplanationSchema:
        system_instruction = """
        You are a coding assistant helper. Analyze error contexts 
        and provide simple, clear, actionable feedback with structured details.
        """
        
        last_exception = None

        # Iterate through available models in priority order
        for model_name in self.FALLBACK_MODELS:
            try:
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=f"Analyze this error context and provide feedback, name the layer that encountered the error and how to fix it, give and example also: {error_context}",
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        response_mime_type="application/json",
                        response_schema=AIExplanationSchema,
                        automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
                    ),
                )
                return AIExplanationSchema.model_validate_json(response.text)
            except Exception as e:
                last_exception = e
                print(
                    f"⚠️ [AI SERVICE WARNING]: Model '{model_name}' failed ({e}). Falling back to next model...",
                    flush=True
                )

        # If all models in the loop fail, raise the final exception
        raise ThirdPartyServiceError(
            f"Failed to reach AI service across all fallback models: gemini didnt work hâha {last_exception}"
        )