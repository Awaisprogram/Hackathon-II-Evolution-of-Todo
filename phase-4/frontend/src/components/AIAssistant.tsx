"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X, Maximize2, Minimize2, Check } from "lucide-react";
import ThreeDotBounce from "./ThreeDotBounce";
import { marked } from "marked";
import { FaRegPaperPlane } from "react-icons/fa";

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [streamingReply, setStreamingReply] = useState("");
  const [isLarge, setIsLarge] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, streamingReply]);

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend || isLoading) return;

    const newMessages = [...messages, { role: "user", text: messageToSend }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setShowWelcome(false);
    setStreamingReply("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      if (!res.body) throw new Error("No response body from backend");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botReply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim()) {
            try {
              const parsed = JSON.parse(line.trim());
              if (parsed.chunk) {
                botReply += parsed.chunk;
                setStreamingReply(botReply);
              }
              if (parsed.error) throw new Error(parsed.error);
            } catch (err) {
              console.error("Stream parse error:", err);
            }
          }
        }
      }

      setStreamingReply("");
      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      console.error("❌ Streaming failed:", error);
      const errorMessage = "❌ Sorry, something went wrong. Please try again.";
      setMessages([...newMessages, { role: "bot", text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setMessages([]);
    setShowWelcome(true);
    setInput("");
    setStreamingReply("");
  };

  const handleLarge = () => setIsLarge(!isLarge);
  const handleChatClick = (e: React.MouseEvent) => e.stopPropagation();
  const handleChatWheel = (e: React.WheelEvent) => e.stopPropagation();

  return (
    <main>
      {/* Floating Chat Button - Updated to Navy theme */}
      <motion.button
        aria-label="Open AI Assistant Chat"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-6 right-8 z-40 bg-[#0f172a] text-white p-4 rounded-full shadow-[0_0_20px_rgba(15,23,42,0.3)] border border-slate-700 cursor-pointer"
      >
        <Check size={24} />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence mode="popLayout">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              key="chatbox"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={handleChatClick}
              onWheel={handleChatWheel}
              className={`${
                isLarge ? "w-[50vw] h-[85vh]" : "md:w-[400px] h-[600px] w-[90%]"
              } fixed bottom-24 md:right-8 right-5 rounded-3xl border border-slate-700 bg-[#0f172a] flex flex-col z-50 transition-all duration-300 shadow-2xl overflow-hidden`}
            >
              {/* Header - Navy Gradient */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-[#0f172a] to-[#1e293b]">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600">
                    <Check className="w-5 h-5 text-blue-400" />
                    <div className="w-2.5 h-2.5 rounded-full absolute bottom-0 right-0 bg-green-500 border-2 border-[#0f172a]" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-sm">AI Assistant</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                      {isLoading ? "Typing..." : "Online"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={handleRefresh} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <RotateCcw size={18} />
                  </button>
                  <button onClick={handleLarge} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:block">
                    {isLarge ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4 bg-[#0f172a]">
                {showWelcome && messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
                      <Check className="text-slate-400" size={24} />
                    </div>
                    <p className="text-slate-400 text-sm max-w-[200px]">
                      How can I help you manage your tasks today?
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, ind) => (
                      <div key={ind} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] leading-relaxed ${
                          msg.role === "user" 
                            ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20" 
                            : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                        }`}>
                          <div dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none">
                          {streamingReply ? (
                             <div className="text-sm text-slate-200" dangerouslySetInnerHTML={{ __html: marked(streamingReply) }} />
                          ) : (
                            <ThreeDotBounce />
                          )}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Section */}
              <div className="p-4 bg-[#0f172a] border-t border-slate-800">
                <div className="relative flex items-center">
                  <input
                    className="w-full pl-4 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
                    placeholder="Message AI..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl transition-all"
                  >
                    <FaRegPaperPlane size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}