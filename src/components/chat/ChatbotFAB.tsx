import { useState } from "react";
import { MessageCircle, X, Mic, Send, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const ChatbotFAB = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hello! I'm AgriDetect AI Assistant. Ask me about plant diseases in your local language! 🌱", isUser: false },
  ]);
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { text: message, isUser: true }]);
    setMessage("");
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "I understand you're asking about plant health. Could you please share an image of your plant, or describe the symptoms you're seeing?", 
        isUser: false 
      }]);
    }, 1000);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice functionality would be implemented here
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-8 w-[calc(100vw-2rem)] md:w-96 max-h-[70vh] bg-card rounded-2xl shadow-2xl border border-border animate-scale-in z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="gradient-primary p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/20 rounded-full">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AgriDetect Assistant</h3>
                  <p className="text-xs opacity-80">Ask in your local language</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  msg.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm",
                    msg.isUser
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  {msg.text}
                  {!msg.isUser && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 ml-2 inline-flex"
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex gap-2">
              <Button
                variant={isListening ? "default" : "outline"}
                size="icon"
                onClick={toggleVoice}
                className={cn(
                  "shrink-0",
                  isListening && "animate-pulse bg-destructive"
                )}
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Type your question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSend} className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              🎤 Voice input available • Supports Hindi, Tamil, Telugu & more
            </p>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-4 md:right-8 z-50 p-4 rounded-full shadow-lg transition-all duration-300 group",
          "gradient-primary hover:scale-110",
          isOpen && "rotate-90"
        )}
      >
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
        <MessageCircle className="w-6 h-6 text-primary-foreground relative z-10" />
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ask in your local language 🗣️
          </div>
        )}
      </button>
    </>
  );
};
