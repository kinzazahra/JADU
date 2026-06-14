import os
import tempfile
from sarvamai import SarvamAI
from core.config import settings

# Initialize Sarvam Client (Make sure SARVAM_API_KEY is in your .env file)
# If you haven't put it in .env yet, you can temporarily paste your key here for testing:
# client = SarvamAI(api_subscription_key="YOUR_SARVAM_KEY_HERE")
client = SarvamAI(api_subscription_key=settings.SARVAM_API_KEY)
print("SARVAM KEY LENGTH:", len(settings.SARVAM_API_KEY))

def transcribe_audio(audio_bytes: bytes) -> str:
    """Uses Sarvam AI to transcribe the incoming voice command."""
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
        temp_file.write(audio_bytes)
        temp_file_path = temp_file.name

    try:
        print("Sending audio to Sarvam AI...")
        with open(temp_file_path, "rb") as audio_file:
            response = client.speech_to_text.transcribe(
                file=audio_file,
                model="saaras:v3",
                mode="transcribe" 
            )
            
        transcript = response.transcript.strip() if response.transcript else ""
        print(f"Sarvam Output: {transcript}")
        return transcript
        
    except Exception as e:
        print(f"Sarvam AI Error: {e}")
        return ""
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)