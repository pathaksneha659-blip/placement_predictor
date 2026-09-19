import React, { useState, useEffect, useRef } from "react";
import { 
  FaRobot, 
  FaPaperPlane, 
  FaUser, 
  FaSpinner, 
  FaInfoCircle, 
  FaRedoAlt
} from "react-icons/fa";
import { sendCareerChat } from "../../../services/api";
import { getProgressData } from "../../../utils/progressStorage";

const SUGGESTED_PROMPTS = [
  { label: "💡 Analyze my weaknesses", text: "Analyze my weaknesses" },
  { label: "📅 Create my study plan", text: "Create my study plan" },
  { label: "📄 Improve my resume", text: "Improve my resume" },
  { label: "🎯 Prepare me for interviews", text: "Prepare me for interviews" },
  { label: "💻 How can I improve my coding?", text: "How can I improve my coding?" },
  { label: "🌟 Which role is best for me?", text: "Which role is best for me?" },
];

export default function CareerAssistant({ currentProfile = null, currentResult = null }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your AI Career Assistant. I can help answer questions about your preparation roadmap, study schedule, skill gaps, resume improvements, and campus interview strategy.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLlm: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend = null) => {
    const query = textToSend || inputMessage;
    if (!query || !query.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { sender: "user", text: query, time: userTime }];
    setMessages(newMessages);
    if (!textToSend) setInputMessage("");
    setLoading(true);

    const progressData = getProgressData();
    const studentContext = {
      placement_probability: currentResult ? currentResult.placement_probability : 68.5,
      placement_status: currentResult ? currentResult.placement_status : "Placed",
      skill_gaps: currentResult && currentResult.top_priorities ? currentResult.top_priorities : ["Coding Skill", "Aptitude"],
      study_hours: currentProfile ? currentProfile.study_hours_per_day : 3.5,
      completed_goals: progressData && progressData.today ? progressData.today.completedGoals : 2,
      pending_goals: progressData && progressData.today ? (progressData.today.totalGoals - progressData.today.completedGoals) : 1,
      resume_score: 78,
      recommended_roles: ["Software Engineer", "Backend Developer", "Full-Stack Web Developer"],
    };

    try {
      const response = await sendCareerChat(query, studentContext);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.reply,
          time: botTime,
          isLlm: response.is_llm_generated || false,
        },
      ]);
    } catch (err) {
      console.error("Career chat error:", err);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I experienced a connection error querying the backend. Please check if the FastAPI server is running on http://127.0.0.1:8000.",
          time: botTime,
          isLlm: false,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hello! I am your AI Career Assistant. I can help answer questions about your preparation roadmap, study schedule, skill gaps, resume improvements, and campus interview strategy.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLlm: false,
      },
    ]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6 animate-fadeIn pb-12">
      {/* Header Panel */}
      <div className="glass-panel p-4 sm:p-6 md:p-8 rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 shadow-luxury">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="p-2 sm:p-3 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[#9F595B] flex-shrink-0">
            <FaRobot className="text-lg sm:text-xl" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold text-[#30241D] tracking-tight font-serif">
                AI Career Assistant
              </h3>
              <span className="px-1.5 sm:px-2 py-0.5 rounded bg-[#FBF8F2] border border-[#D8C8B5] text-[#9F595B] text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                AI Advice
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#756354] mt-0.5">
              Personalized career guidance derived from your candidate profile metrics & progress.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={clearChat}
          className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FBF8F2] hover:bg-[#F5EFE6] text-[#30241D] border border-[#D8C8B5] transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-card"
        >
          <FaRedoAlt className="text-[10px]" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Main Chat Box Container */}
      <div className="glass-panel rounded-xl border border-[#D8C8B5] bg-[#EDE3D4] flex flex-col h-[480px] sm:h-[540px] md:h-[580px] overflow-hidden relative shadow-luxury">
        {/* Chat Messages Stream */}
        <div className="flex-1 p-3 sm:p-5 md:p-6 overflow-y-auto space-y-3 sm:space-y-4 no-scrollbar bg-[#F5EFE6]/60">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2 sm:space-x-3 ${
                msg.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.sender === "user"
                  ? "bg-[#9F595B] text-white"
                  : "bg-[#FBF8F2] border border-[#D8C8B5] text-[#9F595B]"
              }`}>
                {msg.sender === "user" ? <FaUser className="text-[10px] sm:text-xs" /> : <FaRobot className="text-[10px] sm:text-xs" />}
              </div>

              {/* Message Content Bubble */}
              <div className={`max-w-[88%] sm:max-w-[78%] space-y-1 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}>
                <div className={`p-3 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-card ${
                  msg.sender === "user"
                    ? "bg-[#9F595B] text-white"
                    : msg.isError
                    ? "bg-[#A65D5D]/15 border border-[#A65D5D] text-[#A65D5D]"
                    : "bg-[#FBF8F2] border border-[#D8C8B5] text-[#30241D]"
                }`}>
                  {msg.text}
                </div>

                <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] text-[#756354] px-1">
                  <span>{msg.time}</span>
                  {msg.sender === "bot" && (
                    <span className="text-[9px] sm:text-[10px] text-[#9F595B] font-mono">
                      • {msg.isLlm ? "Gemini LLM Reply" : "Career Rule Engine"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[#9F595B] flex items-center justify-center flex-shrink-0">
                <FaRobot className="text-xs" />
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#FBF8F2] border border-[#D8C8B5] text-xs text-[#756354] flex items-center space-x-2">
                <FaSpinner className="animate-spin text-[#9F595B]" />
                <span className="text-[11px] sm:text-xs">Analyzing student profile & formulating career advice...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="p-2 sm:p-3 bg-[#EDE3D4] border-t border-[#D8C8B5] flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#756354] whitespace-nowrap pl-1">
            Suggested:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt.text)}
              disabled={loading}
              className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#FBF8F2] hover:bg-[#F5EFE6] text-[#30241D] border border-[#D8C8B5] transition whitespace-nowrap cursor-pointer disabled:opacity-50 font-semibold shadow-card flex-shrink-0"
            >
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-2.5 sm:p-4 bg-[#EDE3D4] border-t border-[#D8C8B5] flex items-center space-x-2 sm:space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question (e.g. 'What should I study today?')..."
            className="flex-1 bg-[#F5EFE6] border border-[#D8C8B5] rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#30241D] placeholder-[#756354] focus:outline-none focus:border-[#9F595B] transition"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={loading || !inputMessage.trim()}
            className="px-3.5 sm:px-4 py-2 sm:py-3 rounded-xl bg-[#9F595B] hover:bg-[#824647] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer shadow-card flex-shrink-0"
          >
            <FaPaperPlane className="text-xs" />
          </button>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="p-3 sm:p-3.5 rounded-lg bg-[#FBF8F2] border border-[#D8C8B5] text-[11px] sm:text-xs text-[#756354] flex items-start space-x-2 shadow-card leading-relaxed">
        <FaInfoCircle className="text-[#9F595B] text-xs sm:text-sm flex-shrink-0 mt-0.5" />
        <span>
          <strong>Architecture Note</strong>: Advice provided by the AI Career Assistant is generated to guide student study planning and skill development. It is strictly separate from the trained machine learning placement prediction model.
        </span>
      </div>
    </div>
  );
}
