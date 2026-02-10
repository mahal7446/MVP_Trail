"""
Chat service for AI-powered agricultural assistant using Google Gemini
Provides context-aware multilingual advice for plant disease management
"""
import os
import requests
import google.generativeai as genai
from typing import Dict, Optional
import hashlib
import sys

# Language names for prompt context
LANGUAGE_NAMES = {
    'en': 'English',
    'hi': 'Hindi',
    'kn': 'Kannada',
    'te': 'Telugu',
    'ta': 'Tamil',
    'bn': 'Bengali'
}

# Simple response cache to handle quota limits
_response_cache = {}

class ChatService:
    """Service for handling AI chat interactions with agricultural context"""
    
    def __init__(self):
        """Initialize AI client. Prefer OpenAI if OPENAI_API_KEY is set, else Gemini"""
        # Prefer OpenAI when available
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key:
            self.use_openai = True
            self.openai_key = openai_key
            print(f"[OK] OPENAI_API_KEY found: {openai_key[:8]}...")
        else:
            self.use_openai = False

        # (Gemini initialization handled above when OpenAI key is not present)

        if not self.use_openai:
            api_key = os.getenv('GEMINI_API_KEY') or os.getenv('VITE_GEMINI_API_KEY')
            if not api_key:
                print("[ERROR] GEMINI_API_KEY environment variable not found and OPENAI_API_KEY not set!")
                raise ValueError("No AI API key found in environment variables")

            print(f"[OK] GEMINI_API_KEY found: {api_key[:10]}...")
            genai.configure(api_key=api_key)

            generation_config = {
                'temperature': 0.7,
                'top_p': 0.9,
                'top_k': 40,
                'max_output_tokens': 200,
                'candidate_count': 1,
            }

            print("[INFO] Initializing Gemini model...")
            try:
                self.model = genai.GenerativeModel(
                    'gemini-1.5-flash',
                    generation_config=generation_config
                )
                print("[OK] Gemini model initialized (gemini-1.5-flash)")
            except Exception as e:
                print(f"[WARNING] Failed to initialize gemini-1.5-flash: {str(e)}")
                try:
                    self.model = genai.GenerativeModel(
                        'gemini-pro',
                        generation_config=generation_config
                    )
                    print("[OK] Fallback model (gemini-pro) initialized")
                except Exception as e2:
                    print(f"[ERROR] Failed to init any model: {str(e2)}")
                    raise
        
    def build_system_prompt(self, context: Dict, language: str) -> str:
        """Build agricultural expert system prompt"""
        crop = context.get('crop', 'Unknown')
        disease = context.get('disease', 'None')
        language_name = LANGUAGE_NAMES.get(language, 'English')
        
        has_disease_context = disease != 'None' and disease != 'Unknown' and crop != 'General'
        
        if has_disease_context:
            system_prompt = f"""You are an agricultural expert. Context: {crop} with {disease}.

Provide brief, practical advice (3-4 sentences max):
- Treatment steps
- Prevention tips
- Fertilizer if relevant

Respond ONLY in {language_name}. Be direct and farmer-friendly."""
        else:
            system_prompt = f"""You are an agricultural expert helping farmers.

Answer briefly (3-4 sentences max) about farming, crops, diseases, fertilizers.

Respond ONLY in {language_name}. Be practical and direct."""
        
        return system_prompt
    
    def get_initial_greeting(self, context: Dict, language: str) -> str:
        """Generate initial greeting message"""
        crop = context.get('crop', 'plant')
        disease = context.get('disease', 'issue')
        
        greetings = {
            'en': f"Hello! I can see your {crop} has {disease}. I'm here to help. What would you like to know?",
            'hi': f"नमस्ते! मैं देख सकता हूं कि आपके {crop} में {disease} है। मैं यहां सहायता के लिए हूं।",
            'kn': f"ನಮಸ್ಕಾರ! ನಿಮ್ಮ {crop} ಗೆ {disease} ಇದೆ. ನಾನು ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದೆ.",
            'te': f"నమస్కారం! మీ {crop} కి {disease} ఉందని చూడుచున్నాను.",
            'ta': f"வணக்கம்! உங்கள் {crop} க்கு {disease} உள்ளது.",
            'bn': f"নমস্কার! আপনার {crop} এ {disease} দেখছি।"
        }
        
        return greetings.get(language, greetings['en'])
    
    def get_chat_response(
        self, 
        user_message: str, 
        context: Dict, 
        language: str = 'en',
        chat_history: Optional[list] = None
    ) -> Dict:
        """Get AI response with agricultural context"""
        try:
            # Create cache key
            cache_key = hashlib.md5(
                f"{user_message}:{context}:{language}".encode()
            ).hexdigest()
            
            # Check cache
            if cache_key in _response_cache:
                print(f"[OK] Cached response for: {user_message[:30]}...")
                return {
                    'success': True,
                    'response': _response_cache[cache_key],
                    'language': language,
                    'cached': True
                }
            
            system_prompt = self.build_system_prompt(context, language)
            full_prompt = f"{system_prompt}\n\nQ: {user_message}\n\nA:"
            
            print(f"[DEBUG] Sending to AI provider: {user_message[:40]}...")
            
            safety_settings = [
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            ]
            
            # If using OpenAI, call their API
            if getattr(self, 'use_openai', False):
                try:
                    headers = {
                        'Authorization': f'Bearer {self.openai_key}',
                        'Content-Type': 'application/json'
                    }
                    payload = {
                        'model': 'gpt-3.5-turbo',
                        'messages': [
                            {'role': 'system', 'content': system_prompt},
                            {'role': 'user', 'content': user_message}
                        ],
                        'max_tokens': 200,
                        'temperature': 0.7,
                    }
                    resp = requests.post('https://api.openai.com/v1/chat/completions', json=payload, headers=headers, timeout=15)
                    if resp.status_code == 200:
                        data = resp.json()
                        response_text = data['choices'][0]['message']['content'].strip()
                        # Cache and return
                        _response_cache[cache_key] = response_text
                        return {'success': True, 'response': response_text, 'language': language}
                    else:
                        api_error = Exception(f'OpenAI API error: {resp.status_code} {resp.text}')
                        raise api_error
                except Exception as api_error:
                    error_str = str(api_error).lower()
                    error_type = type(api_error).__name__
                    print(f"[DEBUG] API Error: {error_type}")
                    print(f"[DEBUG] Message: {error_str[:80]}")
                    # Quota exhausted - use fallback
                    if "quota" in error_str or "429" in error_str or "rate limit" in error_str:
                        print(f"[WARNING] OpenAI quota/rate limit - using fallback")
                        crop = context.get('crop', 'plant')
                        disease = context.get('disease', 'condition')
                        fallback_responses = {
                            'en': f"For {crop} with {disease}: 1) Remove infected parts immediately, 2) Improve air circulation around the plant, 3) Apply fungicide if needed, 4) Consult local agricultural extension.",
                        }
                        response_text = fallback_responses.get(language, fallback_responses['en'])
                        _response_cache[cache_key] = response_text
                        return {'success': True, 'response': response_text, 'language': language, 'fallback': True}
                    # otherwise fallthrough to Gemini path if available
            # Not using OpenAI or OpenAI failed - use Gemini if configured
            try:
                response = self.model.generate_content(
                    full_prompt,
                    safety_settings=safety_settings
                )
            except Exception as api_error:
                error_str = str(api_error).lower()
                error_type = type(api_error).__name__
                print(f"[DEBUG] API Error: {error_type}")
                print(f"[DEBUG] Message: {error_str[:80]}")
                # Quota exhausted - use fallback
                if "quota" in error_str or "429" in error_str or "resource_exhausted" in error_str or "ResourceExhausted" in error_type:
                    print(f"[WARNING] Quota exceeded - using fallback")
                    crop = context.get('crop', 'plant')
                    disease = context.get('disease', 'condition')
                    fallback_responses = {
                        'en': f"For {crop} with {disease}: 1) Remove infected parts immediately, 2) Improve air circulation around the plant, 3) Apply fungicide if needed, 4) Consult local agricultural extension.",
                        'hi': f"{crop} में {disease} के लिए: 1) प्रभावित भाग हटाएं, 2) हवा संचार बेहतर करें, 3) कवकनाशी लागू करें।",
                        'kn': f"{crop}ಗೆ {disease}ಠಿಂದ: 1) ಪ್ರಭಾವಿತ ಭಾಗ ತೆಗೆಯಿರಿ, 2) ಗಾಳಿ ಸಂಚಾರ ಸುಧಾರಿಸಿ, 3) ಕವಕನಾಶಕ ಪ್ರಯೋಗ ಮಾಡಿ।",
                        'te': f"{crop} {disease}: 1) ప్రభావిత భాగాలను తొలగించండి, 2) గాలి సంచారం మెల్లుకోండి, 3) శిలీంద్ర నిరోధకం వర్తించండి।",
                        'ta': f"{crop} {disease}: 1) பாதிக்கப்பட்ட பகுதி நீக்கவும், 2) காற்று சுழற்சி மேம்படுத்தவும், 3) பூஞ்சையைக்க பூஞ்சை கொல்லிப் பயன்படுத்தவும்.",
                        'bn': f"{crop} {disease}: 1) প্রভাবিত অংশ সরান, 2) বায়ু সংচালন উন্নত করুন, 3) ছত্রাকনাশক প্রয়োগ করুন।"
                    }
                    response_text = fallback_responses.get(language, fallback_responses['en'])
                    _response_cache[cache_key] = response_text
                    return {'success': True, 'response': response_text, 'language': language, 'fallback': True}
                # Retry with simpler prompt
                print("[INFO] Retrying with simpler prompt...")
                response = self.model.generate_content(
                    f"Answer in {LANGUAGE_NAMES.get(language, 'English')}: {user_message}"
                )
            
            # Check if blocked
            if not response.candidates or response.candidates[0].finish_reason != 1:
                print("[WARNING] Response blocked")
                return {
                    'success': False,
                    'response': "I couldn't generate a response. Please try rephrasing your question.",
                    'error': 'Response blocked'
                }

            response_text = response.text.strip()
            
            if not response_text:
                response_text = "I couldn't generate a response. Please try again."
            
            # Cache it
            _response_cache[cache_key] = response_text
            print(f"[OK] Response: {len(response_text)} chars")
            
            return {
                'success': True,
                'response': response_text,
                'language': language
            }
            
        except Exception as e:
            print(f"[ERROR] Chat failed: {str(e)}")
            error_messages = {
                'en': "I'm currently unable to process your request. Please try again.",
                'hi': "मैं अभी आपके अनुरोध को संसाधित नहीं कर सकता।",
                'kn': "ನಾನು ಈಗ ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.",
                'te': "నేను ఇప్పుడు మీ అభ్యర్థనను ప్రక్రియ చేయలేను.",
                'ta': "நான் இப்போது உங்கள் கோரிக்கையைச் செயல்படுத்த முடியாது.",
                'bn': "আমি বর্তমানে আপনার অনুরোধ প্রক্রিয়া করতে পারছি না।"
            }
            
            return {
                'success': False,
                'response': error_messages.get(language, error_messages['en']),
                'error': str(e)
            }

_chat_service = None

def get_chat_service() -> ChatService:
    """Get or create ChatService singleton"""
    global _chat_service
    if _chat_service is None:
        _chat_service = ChatService()
    return _chat_service
