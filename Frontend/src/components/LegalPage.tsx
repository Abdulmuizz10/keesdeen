import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface LegalPageProps {
  type: "privacy" | "terms" | "shipping";
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fixed: Proper mapping for all three types
        const fileMap: Record<string, string> = {
          privacy: "privacy-policy.md",
          terms: "terms-of-service.md",
          shipping: "shipping-info.md",
        };

        const fileName = fileMap[type];
        const response = await fetch(`/legal/${fileName}`);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Error loading legal document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-sm text-gray-500 uppercase tracking-wider">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Fixed: Proper title mapping for all three types
  // const titleMap: Record<string, string> = {
  //   privacy: "Privacy Policy",
  //   terms: "Terms of Service",
  //   shipping: "Shipping & Returns",
  // };

  // const title = titleMap[type];
  // const lastUpdated = "January 01, 2026";

  return (
    <section className="placing">
      {/* Header */}
      {/* <div className="mb-12 pb-8 border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4">
          {title}
        </h1>
        <p className="text-sm text-gray-500 uppercase tracking-wider">
          Last Updated: {lastUpdated}
        </p>
      </div> */}

      {/* Content */}
      <article className="prose prose-sm md:prose-base max-w-none legal-content">
        <ReactMarkdown
          components={{
            // Headings
            h1: ({ children }) => (
              <h1 className="text-3xl font-light tracking-tight mt-12 mb-6 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-light tracking-tight mt-10 mb-4 pb-2 border-b border-gray-100">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-normal mt-8 mb-3">{children}</h3>
            ),
            // Paragraphs
            p: ({ children }) => (
              <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
            ),
            // Lists
            ul: ({ children }) => (
              <ul className="space-y-2 mb-6 ml-6">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-2 mb-6 ml-6 list-decimal">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-700 leading-relaxed pl-2">{children}</li>
            ),
            // Links
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-black underline hover:text-gray-600 transition-colors"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  href?.startsWith("http") ? "noopener noreferrer" : undefined
                }
              >
                {children}
              </a>
            ),
            // Strong text
            strong: ({ children }) => (
              <strong className="font-medium text-gray-900">{children}</strong>
            ),
            // Horizontal rule
            hr: () => <hr className="my-8 border-t border-gray-200" />,
            // Blockquote
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 my-6 italic text-gray-600">
                {children}
              </blockquote>
            ),
            // Code
            code: ({ children }) => (
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                {children}
              </code>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {/* Footer CTA */}
      <div className="mt-16 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600 mb-8">
          Have questions about our{" "}
          {type === "privacy"
            ? "privacy practices"
            : type === "terms"
            ? "terms"
            : "shipping and returns"}
          ?
        </p>
        <a
          href="/contact"
          className="border border-gray-900 bg-gray-900 px-6 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
};

export default LegalPage;
