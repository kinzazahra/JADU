import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# Load .env file
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Get API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(f"CRITICAL ERROR: Could not find GEMINI_API_KEY in {env_path}")

# Initialize Gemini client
client = genai.Client(api_key=api_key)

# Current Gemini model
MODEL_ID = "gemini-2.5-flash"

def process_intent(transcript: str) -> str:
    prompt = f"""
    You are JADU VayuSync, an AI desktop agent.

    Convert the following natural language user command into a precise JSON action payload.

    User Command: '{transcript}'

    Return ONLY valid JSON in this format:

    {{
        "action": "browser",
        "steps": ["step1", "step2"],
        "target": ""
    }}

    Do not include markdown, explanations, or code fences.
    """

    try:
        print(f"Sending transcript to {MODEL_ID}...")

        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
        )

        raw_text = response.text.strip()

        # Remove markdown if Gemini returns it
        if raw_text.startswith("```json"):
            raw_text = raw_text.replace("```json", "", 1)

        if raw_text.startswith("```"):
            raw_text = raw_text.replace("```", "", 1)

        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]

        return raw_text.strip()

    except Exception as e:
        print(f"Gemini Error: {e}")

        return """
{
    "action": "error",
    "steps": ["intent_processing_failed"],
    "target": ""
}
""".strip()