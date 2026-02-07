import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Context data structure for AI chatbot
 */
export interface ChatContextData {
    crop: string;
    disease: string;
    confidence: number;
    location?: string;
    severity?: string;
    imageUrl?: string;
}

interface ChatContextType {
    context: ChatContextData | null;
    setContext: (context: ChatContextData) => void;
    clearContext: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
    children: ReactNode;
}

/**
 * Provider component for chatbot context
 * Manages disease prediction data to be shared with chatbot
 */
export const ChatProvider = ({ children }: ChatProviderProps) => {
    const [context, setContextState] = useState<ChatContextData | null>(null);

    const setContext = (newContext: ChatContextData) => {
        setContextState(newContext);
        console.log('[ChatContext] Context updated:', newContext);
    };

    const clearContext = () => {
        setContextState(null);
        console.log('[ChatContext] Context cleared');
    };

    return (
        <ChatContext.Provider value={{ context, setContext, clearContext }}>
            {children}
        </ChatContext.Provider>
    );
};

/**
 * Hook to access chatbot context
 * Must be used within ChatProvider
 */
export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within ChatProvider');
    }
    return context;
};
