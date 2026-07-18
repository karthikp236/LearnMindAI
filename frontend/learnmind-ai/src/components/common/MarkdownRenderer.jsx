import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ children }) => {
  return (
    <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {children || ""}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;