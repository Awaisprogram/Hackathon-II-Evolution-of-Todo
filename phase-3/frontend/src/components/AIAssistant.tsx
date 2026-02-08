"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, X, Maximize2, Minimize2 } from "lucide-react";
import ThreeDotBounce from "./ThreeDotBounce";
import { marked } from "marked";
import { FaRegPaperPlane, FaRobot } from "react-icons/fa";

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

  const suggestedQuestions = [
    "What projects have you worked on?",
    "Tell me about your technical skills",
    "How can I get in touch with you?",
  ];

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

    // Store user message and get conversation ID
    

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

  
  const handleSuggestedQuestion = (question: string) => sendMessage(question);

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
      {/* Floating Chat Button */}
      <motion.button
        aria-label="Open AI Assistant Chat"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-5 right-8 md:right-6 xs:bottom-4 xs:right-4 z-40
        dark:bg-[#fff9f6] dark:text-black bg-gray-950 text-white  p-4 rounded-full shadow-lg border border-gray-200
        dark:border-gray-800  cursor-pointer"
      >
          <FaRobot size={24} />
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
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              key="chatbox"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={handleChatClick}
              onWheel={handleChatWheel}
              className={`${
                isLarge
                  ? "w-[45vw] h-[80vh]"
                  : "md:w-[35vw] h-[70vh] w-[90%]  "
              } fixed bottom-24 md:right-[6px] right-8
              rounded-3xl border border-gray-300 
              bg-[#fff9f6]/80 dark:bg-black/80 c 
              flex flex-col z-50 transition-all duration-300 shadow-2xl`}
              
            >
              {/* Animated Header Gradient */}
              <div className="relative w-full flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 rounded-t-3xl ">
                <div className="flex items-center gap-3 flex-1">
                  <motion.div
                    className="relative w-12 h-12 bg-gradient-to-br from-gray-950 to-gray-700 dark:from-gray-50 dark:to-gray-300 rounded-full flex items-center justify-center shadow-lg"
                    animate={{ boxShadow: ["0 0 20px rgba(59, 130, 246, 0.3)", "0 0 40px rgba(59, 130, 246, 0.5)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaRobot className="w-6 h-6 text-white dark:text-gray-900" />
                    <motion.div
                      className="w-3 h-3 rounded-full absolute bottom-0 right-0 bg-gradient-to-br from-green-400 to-green-600 border-2 border-white dark:border-gray-900"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <div className="min-w-0">
                    <h2 className="text-black dark:text-white font-bold text-base sm:text-lg truncate">
                      AI Assistant
                    </h2>
                    <p className="text-xs sm:text-sm font-light text-gray-500 dark:text-gray-400">
                      {isLoading ? (
                        <motion.span
                          animate={{ opacity: [0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          Thinking...
                        </motion.span>
                      ) : (
                        "Ready to help"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <motion.button
                    onClick={handleRefresh}
                    className="text-gray-600 hover:text-blue-600 hover:bg-green-50 
                    rounded-full dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-green-400 p-2 transition-colors"
                  >
                    <RotateCcw size={20} />
                  </motion.button>
                  <motion.button
                    onClick={handleLarge}
                    className="text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 
                    rounded-full dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-yellow-400 p-2 transition-colors hidden sm:block"
                  >
                    {isLarge ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
                <div
                  ref={chatContentRef}
                  onWheel={handleChatWheel}
                  className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 px-3 sm:px-4 space-y-3 py-4"
                >
                  {showWelcome && messages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center min-h-full p-4 sm:p-6 space-y-4"
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700"
                      >
                        <FaRobot
                          className="text-gray-900 dark:text-white"
                          size={40}
                        />
                      </motion.div>
                      <p className="text-gray-700 dark:text-gray-400 text-sm text-center">
                        Hi, I am your personal AI assistant. Ask me anything about this portfolio, projects, or experience.
                      </p>
                      <div className="space-y-2 w-full px-2">
                        {suggestedQuestions.map((question, index) => (
                          <motion.button
                            key={index}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 5 }}
                            onClick={() => handleSuggestedQuestion(question)}
                            className="w-full p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white rounded-full text-sm font-light transition-colors"
                          >
                            {question}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ):(
                    <div className="p-4 space-y-3">
                      {messages.map((msg, ind) => (
                        <div
                          key={ind}
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`px-5 py-3 text-sm rounded-2xl max-w-[75%] ${
                              msg.role === "user"
                                ? "bg-gray-800 text-white rounded-tr-none"
                                : "bg-gray-200 text-black rounded-tl-none dark:bg-gray-700 dark:text-white"
                            }`}
                          >
                            {msg.role === "user" ? (
                              msg.text
                            ) : (
                              <div
                                className="text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: marked.parse(msg.text),
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
  
                      {isLoading && streamingReply && (
                        <div className="flex justify-start">
                          <div className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-5 py-3 rounded-2xl text-sm max-w-[75%]">
                            <div
                              className="text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: marked(streamingReply),
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {isLoading && !streamingReply && (
                        <div className="flex justify-start p-2">
                          <ThreeDotBounce />
                        </div>
                      )}

                      
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </div>

              {/* Input Section */}
              <div className="flex gap-2 py-4 px-6 relative w-full">
              <input
                className="flex-1 px-4 py-4 w-full text-sm border bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 outline-none focus:border-gray-400 dark:focus:border-gray-500 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-full"
                placeholder="Ask me something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={isLoading}
              />
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => sendMessage()}
                disabled={isLoading}
                className={`${
                  isLoading
                    ? "bg-gray-400 dark:bg-gray-600"
                    : "bg-gray-800 dark:bg-gray-200"
                } absolute bottom-[23px] right-8 hover:bg-gray-700 dark:hover:bg-gray-300 p-3 rounded-full transition-colors`}
              >
                <FaRegPaperPlane className="w-4 h-4 text-white dark:text-black" />
              </motion.button>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}