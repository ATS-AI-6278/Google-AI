import os
import sys
import time
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Get API Key
api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GOOGLE_AI_API_KEY")
model_id = "gemini-3.1-flash-lite-preview"

if not api_key:
    print("\n❌ Error: GOOGLE_API_KEY not found in .env file.")
    print("Please ensure your .env file contains: GOOGLE_API_KEY=your_key_here")
    sys.exit(1)

# Configure the SDK
genai.configure(api_key=api_key)

# Initialize the model
model = genai.GenerativeModel(model_id)

print(f"\n🚀 Nova Terminal Chat Engine (Python)")
print(f"🤖 Model: {model_id}")
print(f"💬 Type your message and press Enter (Type 'exit' or 'quit' to end)\n")

def chat():
    # Start a chat session with history
    chat_session = model.start_chat(history=[])
    
    while True:
        try:
            user_input = input("ME > ").strip()
            
            if not user_input:
                continue
                
            if user_input.lower() in ["exit", "quit"]:
                print("\n👋 Goodbye!")
                break
            
            print(f"\n{model_id.upper()} > ", end="", flush=True)
            
            # Send message and stream response
            response = chat_session.send_message(user_input, stream=True)
            
            for chunk in response:
                if chunk.text:
                    print(chunk.text, end="", flush=True)
            
            print("\n")
            
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            print("\n")

if __name__ == "__main__":
    chat()
