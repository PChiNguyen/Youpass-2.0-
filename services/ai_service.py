# services/ai_service.py
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from core.exceptions import ThirdPartyServiceError
from schemas.ai_schemas import AIExplanationSchema


class AIService:
    FALLBACK_MODELS = ("gemini-2.5-flash", "gemini-1.5-flash")

    def __init__(self):
        env_file = ".env.test" if os.getenv("TESTING") == "1" else ".env"
        load_dotenv(dotenv_path=env_file, override=True)

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ThirdPartyServiceError(
                message="Gemini API key is missing from environment variables."
            )

        self.client = genai.Client(api_key=api_key)

    def generate_smart_error_payload(self, error_context: str) -> AIExplanationSchema:
        system_instruction = (
            "You are a coding assistant mentor. Analyze error context "
            "and provide clear, simple, actionable feedback with code examples."
        )

        last_exception: Exception | None = None
        for model_name in self.FALLBACK_MODELS:
            try:
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=f"Analyze error context and suggest fix: {error_context}",
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        response_mime_type="application/json",
                        response_schema=AIExplanationSchema,
                    ),
                )
                return AIExplanationSchema.model_validate_json(response.text)
            except Exception as e:
                last_exception = e

        if last_exception is None:
            raise ThirdPartyServiceError(
                message="Failed to reach AI service across fallback models: no model response was produced."
            )

        raise ThirdPartyServiceError(
            message=f"Failed to reach AI service across fallback models: {last_exception!s}"
        )