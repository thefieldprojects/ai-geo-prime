/**
 * AICommandPanel Component - Left panel for AI command chat
 */

import { useState, useRef, useEffect } from "react";
import { Streamdown } from "streamdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface AICommandPanelProps {
  onSendCommand: (message: string) => Promise<string>;
}

export default function AICommandPanel({ onSendCommand }: AICommandPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "AI-GEO Command System online. Ready for tactical queries.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await onSendCommand(input.trim());
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "System error. Unable to process command.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="absolute top-24 left-6 z-10 w-[320px]">
      <div className="glass-panel p-4 flex flex-col h-[calc(100vh-150px)]">
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-white/10">
          <h2 className="text-[#94A3B8] font-ui text-[10px] uppercase tracking-[0.2em]">
            AI COMMAND STREAM
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="bg-[#0F172A]/50 rounded-lg p-3 border border-white/5">
                  <div className="text-[#22D3EE] font-ui text-[9px] uppercase tracking-wider mb-2">
                    SYSTEM
                  </div>
                  <div className="text-white font-ui text-sm prose prose-invert prose-sm max-w-none">
                    <Streamdown>{message.content}</Streamdown>
                  </div>
                </div>
              ) : (
                <div className="inline-block bg-[#F97316]/20 rounded-lg px-3 py-2 border border-[#F97316]/30">
                  <div className="text-white font-ui text-sm">
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-left">
              <div className="bg-[#0F172A]/50 rounded-lg p-3 border border-white/5">
                <div className="text-[#22D3EE] font-ui text-[9px] uppercase tracking-wider mb-2">
                  SYSTEM
                </div>
                <div className="text-[#94A3B8] font-ui text-sm">
                  Processing<span className="animate-pulse">_</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter command..."
            disabled={isLoading}
            className="w-full bg-transparent border-b border-[#334155] focus:border-[#F97316] outline-none text-white font-ui text-sm py-2 transition-colors placeholder:text-[#94A3B8]/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[#F97316] hover:text-[#F97316]/80 disabled:text-[#94A3B8]/30 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
