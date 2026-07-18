
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";
import documentService from "../../services/documentService";
import QuizList from "../Quizzes/QuizList";
import Spinner from "../../components/common/Spinner";
import ChatInterface from "../../components/chat/ChatInterface";
import AIActions from "../../components/ai/AIActions";
import FlashcardList from "../Flashcards/FlashcardList";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  useEffect(() => {
    (async () => {
      try {
        const response = await documentService.getDocumentById(id);
        setDocument(response);
      } catch (e) {
        console.error(e);
        toast.error("Failed to fetch document details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;
    const filePath = document.data.filePath;
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) return filePath;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const renderContent = () => {
    if (!document?.data?.filePath) {
      return (
        <div className="flex h-[500px] items-center justify-center rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">PDF not available.</p>
        </div>
      );
    }

    const pdfUrl = getPdfUrl();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Document Viewer</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Preview your uploaded PDF
            </p>
          </div>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ExternalLink size={16} />
            Open in New Tab
          </a>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <iframe src={pdfUrl} title="PDF Viewer" className="h-[750px] w-full" />
        </div>
      </div>
    );
  };

  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: <ChatInterface documentId={id} /> },
    { name: "AI Actions", label: "AI Actions", content: <AIActions documentId={id} /> },
    { name: "Flashcards", label: "Flashcards", content: <FlashcardList documentId={id} /> },
    { name: "Quizzes", label: "Quizzes", content: <QuizList documentId={id} /> },
  ];

  if (loading) return <Spinner />;

  if (!document) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Document not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:24px_24px] opacity-40 dark:bg-[radial-gradient(#334155_1px,transparent_1px)]" />

      <div className="relative mx-auto max-w-7xl px-8 py-8">
        <div className="mb-8">
          <Link to="/documents" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400">
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Link>

          <h1 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
            {document?.data?.title || document?.title}
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            View and interact with your uploaded document using AI.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`rounded-xl py-2.5 text-sm font-medium transition-all ${
                tab.name==="Flashcards"?"px-4":"px-5"
              } ${
                activeTab===tab.name
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>{tabs.find(t=>t.name===activeTab)?.content}</div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
