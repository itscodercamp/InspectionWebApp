import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100">
      <button 
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-slate-700 text-sm">{question}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="pb-4 text-sm text-slate-500 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export const Help: React.FC = () => {
  const faqs = [
    {
      question: "How do I save a draft?",
      answer: "Drafts are saved automatically as you type. You can leave the app and come back later; your progress will be waiting for you in the 'Pending Uploads' section on the Dashboard."
    },
    {
      question: "Can I edit a vehicle after publishing?",
      answer: "Currently, vehicles marked as 'For Sale' are pushed to the marketplace immediately. To edit, please contact the admin support team."
    },
    {
      question: "What does 'Trusted Verification' mean?",
      answer: "Enabling this toggle marks the vehicle for physical inspection by our Trusted Vehicles team. A badge will be added to the listing once verified."
    },
    {
      question: "Why can't I upload more than 20 images?",
      answer: "To ensure optimal app performance and quick loading times for buyers, we limit listings to 20 high-quality images."
    }
  ];

  return (
    <div className="pb-8 animate-fade-in-up">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Contact Support</h2>
        <div className="space-y-4">
          <a href="tel:+919876543210" className="flex items-center p-3 bg-blue-50 rounded-xl text-blue-700 hover:bg-blue-100 transition-colors">
            <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-70">Call Us</div>
              <div className="font-bold">+91 98765 43210</div>
            </div>
          </a>
          
          <a href="mailto:support@trustedvehicles.com" className="flex items-center p-3 bg-slate-50 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
            <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-70">Email</div>
              <div className="font-bold">support@trustedvehicles.com</div>
            </div>
          </a>

          <div className="flex items-center p-3 bg-green-50 rounded-xl text-green-700">
             <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
               <MessageCircle className="w-5 h-5" />
             </div>
             <div>
                <div className="text-xs font-semibold uppercase tracking-wider opacity-70">WhatsApp</div>
                <div className="font-bold">Available 9 AM - 6 PM</div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-5 py-2 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 py-3">Frequently Asked Questions</h2>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400">
          Trusted Vehicles Inspection App v1.0.4<br/>
          &copy; 2024 All Rights Reserved
        </p>
      </div>
    </div>
  );
};