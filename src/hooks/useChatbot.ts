import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatContextData } from '@/contexts/ChatContext';

const API_BASE_URL = 'http://localhost:5000';

export interface Message {
    text: string;
    isUser: boolean;
    timestamp: Date;
}

interface UseChatbotReturn {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (message: string) => Promise<void>;
    initializeChat: (context: ChatContextData) => Promise<void>;
    clearHistory: () => void;
}

/**
 * Custom hook for AI chatbot functionality
 * Handles message sending, response receiving, and chat state management
 */
export const useChatbot = (): UseChatbotReturn => {
    const { i18n } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chatContext, setChatContext] = useState<ChatContextData | null>(null);

    /**
   * Initialize chat with greeting based on disease detection
   */
    const initializeChat = useCallback(async (context?: ChatContextData) => {
        if (context) {
            setChatContext(context);
        }
        setError(null);

        try {
            // If context exists, get context-specific greeting
            if (context) {
                const response = await fetch(`${API_BASE_URL}/api/chat/greeting`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        context: {
                            crop: context.crop,
                            disease: context.disease,
                            confidence: context.confidence,
                            location: context.location || 'Unknown',
                        },
                        language: i18n.language,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setMessages([{
                            text: data.greeting,
                            isUser: false,
                            timestamp: new Date(),
                        }]);
                        return;
                    }
                }
            }

            // Default general greeting (no context or failed to fetch)
            const greetings: Record<string, string> = {
                'en': "Hello! I'm your AI agricultural advisor. Ask me anything about farming, crop diseases, treatment, prevention, or fertilizers. You can type or use voice!",
                'hi': "नमस्ते! मैं आपका AI कृषि सलाहकार हूं। खेती, फसल रोग, उपचार, रोकथाम या उर्वरक के बारे में कुछ भी पूछें। आप टाइप कर सकते हैं या आवाज का उपयोग कर सकते हैं!",
                'kn': "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಕೃಷಿ ಸಲಹೆಗಾರ. ಕೃಷಿ, ಬೆಳೆ ರೋಗಗಳು, ಚಿಕಿತ್ಸೆ, ತಡೆಗಟ್ಟುವಿಕೆ ಅಥವಾ ರಸಗೊಬ್ಬರಗಳ ಬಗ್ಗೆ ಏನು ಬೇಕಾದರೂ ಕೇಳಿ!",
                'te': "నమస్కారం! నేను మీ AI వ్యవసాయ సలహాదారుని. వ్యవసాయం, పంట వ్యాధులు, చికిత్స, నివారణ లేదా ఎరువుల గురించి ఏదైనా అడగండి!",
                'ta': "வணக்கம்! நான் உங்கள் AI விவசாய ஆலோசகர். விவசாயம், பயிர் நோய்கள், சிகிச்சை, தடுப்பு அல்லது உரங்கள் பற்றி எதையும் கேளுங்கள்!",
                'bn': "নমস্কার! আমি আপনার AI কৃষি পরামর্শদাতা। কৃষি, ফসলের রোগ, চিকিৎসা, প্রতিরোধ বা সারের বিষয়ে যেকোনো কিছু জিজ্ঞাসা করুন!"
            };

            setMessages([{
                text: greetings[i18n.language] || greetings['en'],
                isUser: false,
                timestamp: new Date(),
            }]);
        } catch (err) {
            console.error('[Chatbot] Failed to initialize:', err);
            setMessages([{
                text: "Hello! I'm here to help with agricultural questions. What would you like to know?",
                isUser: false,
                timestamp: new Date(),
            }]);
        }
    }, [i18n.language]);

    /**
   * Send user message and get AI response
   */
    const sendMessage = useCallback(async (message: string) => {
        if (!message.trim()) return;

        setIsLoading(true);
        setError(null);

        // Add user message immediately
        const userMessage: Message = {
            text: message,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    language: i18n.language,
                    context: chatContext ? {
                        crop: chatContext.crop,
                        disease: chatContext.disease,
                        confidence: chatContext.confidence,
                        location: chatContext.location || 'Unknown',
                    } : {
                        crop: 'General',
                        disease: 'None',
                        confidence: 0,
                        location: 'Unknown',
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from server');
            }

            const data = await response.json();

            if (data.success) {
                const botMessage: Message = {
                    text: data.response,
                    isUser: false,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, botMessage]);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err) {
            console.error('[Chatbot] Send message error:', err);
            setError(err instanceof Error ? err.message : 'Failed to send message');

            // Add error message to chat
            const errorMessage: Message = {
                text: "I'm having trouble connecting. Please make sure the backend is running and API key is configured.",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [chatContext, i18n.language]);

    /**
     * Clear chat history
     */
    const clearHistory = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        initializeChat,
        clearHistory,
    };
};
