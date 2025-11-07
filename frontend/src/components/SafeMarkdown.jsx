import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

// 🧱 Error boundary for markdown rendering
class MarkdownErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("⚠️ Markdown render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="text-red-600 italic">
          ⚠️ Error displaying markdown content.
        </p>
      );
    }
    return this.props.children;
  }
}

// 🧩 SafeMarkdown Component (ReactMarkdown v9+ compatible)
export default function SafeMarkdown({ content, className = "" }) {
  if (!content || typeof content !== "string") {
    return (
      <p className="text-gray-500 italic">
        ⚠️ No valid markdown data to display.
      </p>
    );
  }

  return (
    <MarkdownErrorBoundary>
      <div className={`${className} prose prose-sm max-w-none text-gray-700`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1FA2B6] underline hover:text-[#148a9c] transition"
              />
            ),
            li: ({ node, ...props }) => (
              <li {...props} className="list-disc ml-6" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </MarkdownErrorBoundary>
  );
}
