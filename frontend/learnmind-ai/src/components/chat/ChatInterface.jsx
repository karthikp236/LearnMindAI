import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  Trash2,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  Search,
  X,
  Download,
  Pencil,
  ThumbsUp,
  ThumbsDown,
  ArrowDown,
  Square,
  Star,
  Mic,
  MicOff,
  Sun,
  Moon,
} from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import aiService from "../../services/aiService";
import MarkdownRenderer from "../common/MarkdownRenderer";
import DeleteConfirmModal from "../common/DeleteConfirmModal";

const ChatInterface = () => {
  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [feedback, setFeedback] = useState({}); // { [index]: 'up' | 'down' }
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [starred, setStarred] = useState({}); // { [index]: true }
  const [starredOnly, setStarredOnly] = useState(false);

  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("learnmind-theme") === "dark";
    } catch {
      return false;
    }
  });

  const [listening, setListening] = useState(false);
  const [micStatus, setMicStatus] = useState("idle"); // idle | checking | listening
  const recognitionRef = useRef(null);
  const speechSupported =
    typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);

  // ---- Theme -----------------------------------------------------------------

  useEffect(() => {
    try {
      localStorage.setItem("learnmind-theme", isDark ? "dark" : "light");
    } catch {
      // Ignore storage errors (private browsing, quota, etc.)
    }
  }, [isDark]);

  // ---- Scrolling -----------------------------------------------------------

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollButton(distanceFromBottom > 200);
  };

  // ---- Load history ----------------------------------------------------------

  useEffect(() => {
    fetchChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await aiService.getChatHistory(id);
      setMessages(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  // ---- Draft persistence ------------------------------------------------------

  useEffect(() => {
    const saved = localStorage.getItem(`learnmind-draft-${id}`);
    if (saved) setInput(saved);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    localStorage.setItem(`learnmind-draft-${id}`, input);
  }, [input, id]);

  // ---- Starred messages, persisted per document ------------------------------

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`learnmind-starred-${id}`);
      setStarred(saved ? JSON.parse(saved) : {});
    } catch {
      setStarred({});
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    try {
      localStorage.setItem(`learnmind-starred-${id}`, JSON.stringify(starred));
    } catch {
      // Ignore storage errors
    }
  }, [starred, id]);

  const toggleStar = (index) => {
    setStarred((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // ---- Auto-resizing textarea --------------------------------------------------

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  // ---- Keyboard shortcuts -------------------------------------------------------

  useEffect(() => {
    const handler = (e) => {
      const isMeta = e.metaKey || e.ctrlKey;
      const tag = document.activeElement?.tagName;
      const isTyping = tag === "TEXTAREA" || tag === "INPUT";

      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((s) => !s);
      } else if (e.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          setSearchQuery("");
        }
        if (editingIndex !== null) {
          setEditingIndex(null);
          setEditValue("");
        }
      } else if (e.key === "/" && !isTyping) {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen, editingIndex]);

  // ---- Voice input ----------------------------------------------------------------

  const noSpeechRetryRef = useRef(0);

  const startRecognition = () => {
    const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionImpl();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setMicStatus("listening");
    };
    recognition.onresult = (e) => {
      noSpeechRetryRef.current = 0;
      const transcript = e.results?.[0]?.[0]?.transcript || "";
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => {
      setListening(false);
      setMicStatus("idle");
    };
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);

      if (e.error === "no-speech" && noSpeechRetryRef.current < 1) {
        noSpeechRetryRef.current += 1;
        setTimeout(() => startRecognition(), 150);
        return;
      }

      setListening(false);
      setMicStatus("idle");
      noSpeechRetryRef.current = 0;

      const errorMessages = {
        "no-speech": "Didn't catch any speech — click the mic and start talking right away.",
        "audio-capture": "No microphone was found. Check that one is connected and not in use elsewhere.",
        "not-allowed": "Microphone access is blocked. Allow mic permissions for this site in your browser settings.",
        "service-not-allowed": "Microphone access is blocked. Allow mic permissions for this site in your browser settings.",
        network: "Voice recognition needs an internet connection.",
      };

      if (e.error !== "aborted") {
        toast.error(errorMessages[e.error] || `Voice input error: ${e.error}`);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const requestMicrophoneAccess = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw Object.assign(new Error("getUserMedia unsupported"), { name: "NotSupportedError" });
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
  };

  const toggleListening = async () => {
    if (!speechSupported) {
      toast.error("Voice input isn't supported in this browser. Try Chrome, Edge, or Safari.");
      return;
    }

    const isSecureContext = window.isSecureContext || ["localhost", "127.0.0.1"].includes(window.location.hostname);
    if (!isSecureContext) {
      toast.error("Voice input needs HTTPS (or localhost) to access the microphone.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setMicStatus("idle");
      return;
    }

    const isEmbedded = window.self !== window.top;

    setMicStatus("checking");
    try {
      await requestMicrophoneAccess();
    } catch (err) {
      console.error("Microphone access error:", err.name, err.message);
      setMicStatus("idle");

      if (err.name === "NotAllowedError" || err.name === "SecurityError") {
        toast.error(
          isEmbedded
            ? "Microphone is blocked in this embedded preview. Open the page in its own browser tab to use voice input."
            : "Microphone access is blocked. Click the site info icon in your address bar and allow the microphone."
        );
      } else if (err.name === "NotFoundError" || err.name === "OverconstrainedError") {
        toast.error("No microphone was found on this device.");
      } else if (err.name === "NotReadableError") {
        toast.error("Your microphone is already in use by another app or browser tab.");
      } else {
        toast.error("Couldn't access the microphone.");
      }
      return;
    }

    noSpeechRetryRef.current = 0;
    startRecognition();
  };

  // ---- Clear chat --------------------------------------------------------------

  const handleClearChat = async () => {
    try {
      await aiService.clearChatHistory(id);
      setMessages([]);
      setFeedback({});
      setStarred({});
      setShowClearModal(false);
      toast.success("Chat cleared successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear chat.");
    }
  };

  // ---- Sending -------------------------------------------------------------------

  const activeRequestIdRef = useRef(0);

  const sendMessageText = async (text) => {
    if (!text.trim() || sending) return;
    const question = text.trim();
    const requestId = ++activeRequestIdRef.current;

    setMessages((prev) => [...prev, { role: "user", content: question, timestamp: new Date() }]);
    setSending(true);

    try {
      const response = await aiService.chat(id, question);
      if (activeRequestIdRef.current !== requestId) return;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data?.answer || "No response generated.",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      if (activeRequestIdRef.current !== requestId) return;
      console.error(error);
      toast.error(error?.error || error?.message || "Failed to send message");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error?.error ||
            error?.message ||
            "Sorry! Something went wrong while generating the response.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      if (activeRequestIdRef.current === requestId) setSending(false);
    }
  };

  const stopGenerating = () => {
    activeRequestIdRef.current += 1;
    setSending(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const question = input;
    setInput("");
    sendMessageText(question);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const regenerateResponse = async () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) return;
    sendMessageText(lastUserMessage.content);
  };

  // ---- Edit & resend ----------------------------------------------------------------

  const startEdit = (index, content) => {
    setEditingIndex(index);
    setEditValue(content);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const saveEdit = async (index) => {
    if (!editValue.trim() || sending) return;
    const trimmed = editValue.trim();
    const truncated = messages.slice(0, index);
    setEditingIndex(null);
    setEditValue("");
    setMessages(truncated);
    sendMessageText(trimmed);
  };

  const handleEditKeyDown = (e, index) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit(index);
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // ---- Copy / feedback --------------------------------------------------------------

  const copyMessage = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("Copied!");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleFeedback = async (index, type) => {
    setFeedback((prev) => ({ ...prev, [index]: prev[index] === type ? undefined : type }));
    try {
      await aiService.sendFeedback?.(id, index, type);
    } catch {
      // Fail silently
    }
  };

  // ---- Export -----------------------------------------------------------------------

  const exportChat = () => {
    if (!messages.length) return;
    const lines = messages.map((m) => {
      const who = m.role === "user" ? "You" : "LearnMind AI";
      const when = m.timestamp ? new Date(m.timestamp).toLocaleString() : "";
      return `**${who}**${when ? ` — ${when}` : ""}\n\n${m.content}\n`;
    });
    const markdown = lines.join("\n---\n\n");
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnmind-chat-${id}-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Chat exported!");
  };

  // ---- Search + starred filtering -----------------------------------------------------

  const visibleMessages = useMemo(() => {
    let withIndex = messages.map((m, i) => ({ message: m, index: i }));

    if (starredOnly) {
      withIndex = withIndex.filter(({ index }) => starred[index]);
    }

    if (searchOpen && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      withIndex = withIndex.filter(({ message }) => message.content?.toLowerCase().includes(q));
    }

    return withIndex;
  }, [messages, searchOpen, searchQuery, starredOnly, starred]);

  // ---- Date dividers ------------------------------------------------------------------

  const dayLabel = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const sameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    if (sameDay(d, today)) return "Today";
    if (sameDay(d, yesterday)) return "Yesterday";
    return d.toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" });
  };

  const needsDivider = (list, position) => {
    if (!list[position].message.timestamp) return false;
    if (position === 0) return true;
    const prev = list[position - 1].message.timestamp;
    const curr = list[position].message.timestamp;
    if (!prev) return true;
    return dayLabel(prev) !== dayLabel(curr);
  };

  // ---- Relative timestamps --------------------------------------------------------------

  const relativeTime = (date) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.round(diffHr / 24);
    return `${diffDay}d ago`;
  };

  // ---- Render a single message ---------------------------------------------------------

  const renderMessage = (message, index) => {
    const isUser = message.role === "user";
    const isEditing = editingIndex === index;
    const isStarred = !!starred[index];

    if (isUser) {
      return (
        <div key={index} className="flex justify-end animate-[fadeSlideIn_.25s_ease-out]">
          <div className="group max-w-[75%]">
            {isEditing ? (
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <textarea
                  autoFocus
                  rows={2}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleEditKeyDown(e, index)}
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/15 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelEdit}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveEdit(index)}
                    className="rounded-lg bg-gradient-to-br from-pink-600 to-rose-450 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md hover:brightness-105"
                  >
                    Save &amp; resend
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`rounded-2xl rounded-br-md px-4 py-3 text-[15px] leading-7 shadow-sm transition dark:text-slate-100 ${
                    isStarred
                      ? "bg-amber-50 text-slate-900 ring-1 ring-amber-300 dark:bg-amber-500/10 dark:ring-amber-500/40"
                      : "bg-slate-100 text-slate-900 dark:bg-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                <div className="mt-1.5 flex items-center justify-end gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {message.timestamp && (
                    <span className="text-[11px] text-slate-400" title={new Date(message.timestamp).toLocaleString()}>
                      {relativeTime(message.timestamp)}
                    </span>
                  )}
                  <button
                    onClick={() => toggleStar(index)}
                    className={`rounded-md p-1 transition ${
                      isStarred ? "text-amber-500" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    }`}
                    title={isStarred ? "Unstar" : "Star"}
                  >
                    <Star size={13} fill={isStarred ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => startEdit(index, message.content)}
                    className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    title="Edit and resend"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={index} className="group flex gap-3.5 animate-[fadeSlideIn_.3s_ease-out]">
        <div className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-rose-405 shadow-md shadow-pink-500/20 ring-2 ring-white dark:ring-slate-900">
          <Sparkles size={14} className="text-white" strokeWidth={2.25} />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div
            className={`prose prose-sm max-w-none rounded-xl px-3 py-2 text-[15px] leading-7 transition -ml-3 ${
              isStarred ? "bg-amber-50 ring-1 ring-amber-300 dark:bg-amber-500/10 dark:ring-amber-500/40" : ""
            } text-slate-800 dark:text-slate-100`}
          >
            <MarkdownRenderer>{message.content}</MarkdownRenderer>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              onClick={() => copyMessage(message.content, index)}
              className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              title="Copy"
            >
              {copiedIndex === index ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
            <button
              onClick={regenerateResponse}
              className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              title="Regenerate"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={() => toggleStar(index)}
              className={`rounded-md p-1.5 transition ${
                isStarred ? "text-amber-500" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
              title={isStarred ? "Unstar" : "Star"}
            >
              <Star size={14} fill={isStarred ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => handleFeedback(index, "up")}
              className={`rounded-md p-1.5 transition ${
                feedback[index] === "up"
                  ? "text-emerald-600"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
              title="Helpful"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              onClick={() => handleFeedback(index, "down")}
              className={`rounded-md p-1.5 transition ${
                feedback[index] === "down" ? "text-rose-500" : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              }`}
              title="Not helpful"
            >
              <ThumbsDown size={14} />
            </button>
            {message.timestamp && (
              <span
                className="ml-1 text-[11px] text-slate-400"
                title={new Date(message.timestamp).toLocaleString()}
              >
                {relativeTime(message.timestamp)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={isDark ? "dark" : ""}>
        <div className="flex h-[650px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-rose-400 shadow-lg shadow-pink-500/20">
            <Sparkles size={18} className="animate-pulse text-white" />
          </div>
          <p className="mt-4 text-sm text-slate-400">Loading chat history…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex h-[650px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); opacity: .5; }
            30% { transform: translateY(-3px); opacity: 1; }
          }
          @keyframes pulseRing {
            0% { box-shadow: 0 0 0 0 rgba(244,63,94,0.4); }
            70% { box-shadow: 0 0 0 6px rgba(244,63,94,0); }
            100% { box-shadow: 0 0 0 0 rgba(244,63,94,0); }
          }
          .lm-scroll::-webkit-scrollbar { width: 8px; }
          .lm-scroll::-webkit-scrollbar-track { background: transparent; }
          .lm-scroll::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.25); border-radius: 9999px; }
          .lm-scroll::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.4); }
        `}</style>

        {/* Top accent line */}
        <div className="h-[3px] shrink-0 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-rose-400 shadow-md shadow-pink-500/20">
              <Sparkles size={16} className="text-white" strokeWidth={2.25} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-[15px] font-semibold tracking-tight text-transparent dark:from-white dark:to-slate-300">
                  LearnMind AI Tutor
                </h2>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400">Answers are grounded in your document</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setStarredOnly((s) => !s)}
              className={`rounded-lg p-2 transition ${
                starredOnly ? "bg-amber-100 text-amber-600 dark:bg-amber-500/15" : "text-slate-500 hover:bg-slate-100"
              }`}
              title="Show starred messages"
            >
              <Star size={17} fill={starredOnly ? "currentColor" : "none"} />
            </button>
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className={`rounded-lg p-2 transition ${
                searchOpen
                  ? "bg-gradient-to-br from-pink-600 to-rose-500 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              title="Search this conversation (⌘K)"
            >
              <Search size={17} />
            </button>
            <button
              onClick={exportChat}
              disabled={!messages.length}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"
              title="Export chat"
            >
              <Download size={17} />
            </button>
            <button
              onClick={() => setShowClearModal(true)}
              disabled={!messages.length}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"
              title="Clear chat"
            >
              <Trash2 size={17} />
            </button>
            <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
            <button
              onClick={() => setIsDark((d) => !d)}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-2.5 dark:border-slate-800">
            <Search size={15} className="text-slate-400" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search this conversation…"
              className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
            />
            {searchQuery && (
              <span className="text-xs text-slate-400">
                {visibleMessages.length} match{visibleMessages.length === 1 ? "" : "es"}
              </span>
            )}
            <button
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="lm-scroll relative flex-1 overflow-y-auto bg-white px-6 py-6 dark:bg-slate-900"
        >
          <div className="mx-auto max-w-2xl">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 opacity-20 blur-xl" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-rose-400 shadow-lg shadow-pink-500/25">
                    <Sparkles size={24} className="text-white" strokeWidth={2.25} />
                  </div>
                </div>
                <h3 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-xl font-semibold tracking-tight text-transparent dark:from-white dark:to-slate-300">
                  LearnMind AI Tutor
                </h3>
                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  Ask a question about your document to get started.
                </p>
                <p className="mt-4 text-xs text-slate-300 dark:text-slate-600">
                  Tip: press <kbd className="rounded border border-slate-200 px-1 py-0.5 font-mono dark:border-slate-700">/</kbd> to
                  jump to the input, <kbd className="rounded border border-slate-200 px-1 py-0.5 font-mono dark:border-slate-700">⌘K</kbd> to
                  search.
                </p>
              </div>
            ) : visibleMessages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                {starredOnly ? (
                  <>
                    <Star size={22} className="mb-3 text-slate-300" />
                    <p className="text-sm text-slate-400">No starred messages yet.</p>
                  </>
                ) : (
                  <>
                    <Search size={22} className="mb-3 text-slate-300" />
                    <p className="text-sm text-slate-400">No messages match "{searchQuery}".</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {visibleMessages.map(({ message, index }, position) => (
                  <React.Fragment key={index}>
                    {needsDivider(visibleMessages, position) && (
                      <div className="flex items-center justify-center">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-400 dark:bg-slate-800">
                          {dayLabel(message.timestamp)}
                        </span>
                      </div>
                    )}
                    {renderMessage(message, index)}
                  </React.Fragment>
                ))}

                {sending && (
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-rose-400 shadow-md shadow-pink-500/20 ring-2 ring-white dark:ring-slate-900">
                      <Sparkles size={14} className="text-white" strokeWidth={2.25} />
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-slate-400"
                          style={{ animation: "typingBounce 1.2s ease-in-out infinite", animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {showScrollButton && (
            <button
              onClick={() => scrollToBottom()}
              className="absolute bottom-4 right-6 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
              title="Scroll to latest"
            >
              <ArrowDown size={16} />
            </button>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200/80 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSendMessage} className="mx-auto max-w-2xl">
            {micStatus !== "idle" && (
              <div className="mb-2 flex items-center justify-center gap-2 text-xs font-medium text-pink-600 dark:text-pink-400">
                {micStatus === "checking" ? (
                  <>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink-500" />
                    Requesting microphone access…
                  </>
                ) : (
                  <>
                    <span className="flex items-end gap-0.5">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className="w-0.5 rounded-full bg-pink-500"
                          style={{
                            height: 4 + (i % 2) * 6,
                            animation: "typingBounce 0.9s ease-in-out infinite",
                            animationDelay: `${i * 0.12}s`,
                          }}
                        />
                      ))}
                    </span>
                    Listening — speak now
                  </>
                )}
              </div>
            )}

            <div className="flex items-end gap-2 rounded-3xl border border-slate-300 bg-white px-4 py-2.5 shadow-sm transition focus-within:border-pink-400 focus-within:shadow-md focus-within:ring-4 focus-within:ring-pink-500/10 dark:border-slate-700 dark:bg-slate-800">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message LearnMind AI…"
                className="max-h-[160px] flex-1 resize-none bg-transparent py-1.5 text-[15px] text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
              {speechSupported && (
                <button
                  type="button"c
                  onClick={toggleListening}
                  disabled={micStatus === "checking"}
                  className={`mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition disabled:opacity-50 ${
                    listening
                      ? "bg-rose-500 text-white"
                      : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                  style={listening ? { animation: "pulseRing 1.6s ease-out infinite" } : undefined}
                  title={listening ? "Stop listening" : "Voice input"}
                >
                  {listening ? <MicOff size={15} /> : <Mic size={15} />}
                </button>
              )}
              <button
                type={sending ? "button" : "submit"}
                onClick={sending ? stopGenerating : undefined}
                disabled={!sending && !input.trim()}
                className={`mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition hover:scale-105 hover:shadow-md disabled:cursor-not-allowed disabled:scale-100 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:shadow-none ${
                  sending ? "bg-slate-800 hover:bg-slate-700" : "bg-gradient-to-br from-pink-600 to-rose-500"
                }`}
                title={sending ? "Stop generating" : "Send"}
              >
                {sending ? <Square size={12} fill="currentColor" /> : <Send size={15} />}
              </button>
            </div>

    <div className="mt-2 flex flex-col items-center gap-1">
              <p className="text-[11px] text-slate-400">
                Press <span className="font-semibold">Enter</span> to send ·
                <span className="ml-1 font-semibold">Shift + Enter</span> for a new line.
              </p>
              {input.length > 500 && (
                <p className={`text-[11px] ${input.length > 4000 ? "text-rose-500" : "text-slate-400"}`}>
                  {input.length.toLocaleString()} / 4,000
                </p>
              )}
            </div>
            <p className="mt-1 text-center text-[11px] text-slate-400">
              LearnMind AI can make mistakes. Check important information against your document.
            </p>
          </form>
        </div>

        <DeleteConfirmModal
          isOpen={showClearModal}
          title="Clear Chat"
          message="Are you sure you want to permanently clear this chat? This action cannot be undone."
          loading={false}
          onConfirm={handleClearChat}
          onCancel={() => setShowClearModal(false)}
        />
      </div>
    </div>
  );
};

export default ChatInterface;