import { ChevronDown } from 'lucide-react';

interface FaqItemProps {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FaqItem({ id, question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <button
        type="button"
        className="group flex w-full items-center justify-between py-5 text-left focus:outline-none"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-${id}`}
      >
        <div className="min-w-0 pr-8">
          <span
            className={`font-sans text-base font-bold leading-tight transition-colors md:text-lg ${
              isOpen ? 'text-white' : 'text-white/90 group-hover:text-white'
            }`}
          >
            {question}
          </span>
        </div>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-white/80 transition-colors group-hover:text-white">
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
        </span>
      </button>
      <div
        id={`faq-${id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="max-w-3xl pb-5 font-sans text-sm leading-relaxed text-echo-text md:text-base">{answer}</div>
      </div>
    </div>
  );
}
