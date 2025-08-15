import React from "react";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-soft border 
          ${!isUser 
            ? 'bg-purple-200 border-purple-300 text-gray-900' 
            : 'bg-white border-gray-300 text-gray-800'
          }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}