import os
from dotenv import load_dotenv
from google import genai

# Load API key from .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in environment!")
    exit(1)

# Initialize the Gemini Client
client = genai.Client(api_key=api_key)

print("🔍 Querying available models for your API key...\n")

try:
    # Fetch and list all available models
    models_pager = client.models.list()
    
    count = 0
    for model in models_pager:
        # Extract model name directly
        model_name = getattr(model, "name", str(model))
        clean_name = model_name.replace("models/", "")
        print(f"✅ Available Model: {clean_name}")
        count += 1

    if count == 0:
        print("⚠️ No models found for this API Key. Please check your key permissions.")

except Exception as e:
    print(f"❌ Failed to fetch models: {e}")