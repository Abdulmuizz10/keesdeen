import React from "react";
import { AlertCircle, X, Copy, Check } from "lucide-react";

interface CriticalErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: {
    title: string;
    message: string;
    paymentId?: string;
    instructions?: string[];
    contactSupport?: boolean;
  };
}

const CriticalErrorModal: React.FC<CriticalErrorModalProps> = ({
  isOpen,
  onClose,
  error,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const copyPaymentId = () => {
    if (error.paymentId) {
      navigator.clipboard.writeText(error.paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-200">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 bricolage-grotesque">
              {error.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {error.message}
          </p>

          {/* Payment ID */}
          {error.paymentId && (
            <div className="p-4 bg-gray-50 border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
                Payment Reference ID:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm text-gray-900 font-mono bg-white px-3 py-2 border border-gray-300 break-all">
                  {error.paymentId}
                </code>
                <button
                  onClick={copyPaymentId}
                  className="flex-shrink-0 p-2 hover:bg-gray-200 transition-colors rounded"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Instructions */}
          {error.instructions && error.instructions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                What to do next:
              </p>
              <ul className="space-y-2">
                {error.instructions.map((instruction, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="flex-shrink-0 w-5 h-5 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span className="flex-1">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Support */}
          {error.contactSupport && (
            <div className="p-4 bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Need help?</strong> Contact our support team at{" "}
                <a
                  href="mailto:support@keesdeen.com"
                  className="underline hover:text-blue-700"
                >
                  support@keesdeen.com
                </a>
                {error.paymentId && (
                  <span className="block mt-1 text-xs">
                    Include your payment reference ID when contacting us.
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-900 text-white text-sm font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriticalErrorModal;
