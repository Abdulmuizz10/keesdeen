import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { faqData } from "@/lib/constants";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const Faq: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs: FAQItem[] = faqData;

  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((faq) => faq.category))),
  ];

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="placing">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl md:text-5xl font-bold md:mb-4">
          <span>Frequently Asked Questions</span>
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl mx-auto">
          Find answers to common questions about orders, shipping, returns, and
          more.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 border border-gray-300 focus:border-black focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-12 grid grid-cols-3 md:flex md:flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 md:px-6 py-2.5 md:py-4 text-xs uppercase tracking-wider transition-colors ${
              selectedCategory === category
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:border-black"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      {filteredFAQs.length > 0 ? (
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => {
            const isOpen = openItems.includes(index);
            return (
              <div
                key={index}
                className="border border-gray-200 transition-all"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      {faq.category}
                    </p>
                    <h3 className="text-base md:text-lg font-normal">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-2 text-gray-700 text-sm leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No questions found matching your search.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="text-sm underline hover:text-black transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Still Have Questions */}
      <div className="mt-16 pt-12 border-t border-gray-200 text-center">
        <h2 className="text-2xl font-light mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-8">
          Can't find what you're looking for? Our customer service team is here
          to help.
        </p>
        <Link
          to="/contact"
          className="border border-gray-900 bg-gray-900 px-6 py-3 text-sm uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
};

export default Faq;
