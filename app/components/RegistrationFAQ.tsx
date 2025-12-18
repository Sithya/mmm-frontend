import React from "react";

type FAQItem = {
  question: string;
  answer: string | React.ReactNode;
};

const items: FAQItem[] = [
  {
    question: "When is the registration deadline?",
    answer:
      "Early bird registration closes December 31, 2026. Standard registration remains open until January 10, 2027.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Refunds are available until December 15, 2026. After that date, only credits for future conferences will be offered.",
  },
  {
    question: "Is accommodation included?",
    answer:
      "Accommodation is not included in the registration fee. Visit our Venue page for recommended hotels and special conference rates.",
  },
  {
    question: "What's included in registration?",
    answer:
      "Your registration includes access to all sessions, conference materials, meals (breakfast, lunch, coffee breaks), and the welcome reception.",
  },
];

const RegistrationFAQ = () => {
  return (
    <section className="max-w-4xl mx-auto px-[90px] py-16">
      <h1 className="text-3xl md:text-4xl font-semibold text-center text-slate-900 mb-10">
        Registration FAQ
      </h1>

      <div className="space-y-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl shadow-sm p-6"
          >
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              {item.question}
            </h3>
            <p className="text-sm leading-6 text-slate-700 whitespace-pre-line">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RegistrationFAQ;
