"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./HomeFAQ.module.css";

const QUESTIONS = [
  {
    question: "What products does Monagrow supply?",
    answer: "Our core collection includes Basmati rice, estate coffee, mixed dry fruits, and refined sugar. Share the variety, grade, and packaging you need so our trade team can discuss the right specification for your business.",
  },
  {
    question: "How do I request a wholesale quote?",
    answer: "Use Get a Quote to share your product, required quantity, packaging preference, and delivery destination. Include your preferred delivery terms and any specifications so the team can prepare a quotation for your requirements.",
  },
  {
    question: "What is the minimum order quantity?",
    answer: "Minimum quantities depend on the product, packaging, and shipment arrangement. Send your intended order size to our trade team to confirm the options available. The website calculator is a planning tool and does not confirm an order minimum.",
  },
  {
    question: "Can I request a sample before placing an order?",
    answer: "Contact the team with the product and specification you want to evaluate. They can confirm sample availability, any applicable charges, and delivery arrangements before you proceed.",
  },
  {
    question: "What packaging options can I discuss?",
    answer: "You can discuss retail packs and bulk bags with our team. Available sizes and materials depend on the commodity and order requirements. Include any labeling or custom packaging needs in your enquiry for confirmation.",
  },
  {
    question: "Do you arrange international shipping?",
    answer: "Our trade team can discuss export documentation, container loading, and freight arrangements for your destination. Share your destination port and preferred terms, such as FOB, CFR, or CIF, to confirm the shipment scope and responsibilities in your quotation.",
  },
  {
    question: "How can I review product quality and specifications?",
    answer: "Ask for the specifications and available documentation for the product and lot you are considering. Confirm details such as grade, moisture, origin, and any required testing or certification with the team before placing an order.",
  },
  {
    question: "Are the calculator prices final quotations?",
    answer: "No. The calculator uses illustrative planning rates, including sample currency conversions. Product prices, freight, taxes, availability, and delivery terms must be confirmed in a quotation from the trade team.",
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h2 id="faq-heading">Frequently Asked Questions</h2>
            <p>A little clarity before your next order.</p>
          </div>
        </header>
        <div className={styles.accordion}>
          {QUESTIONS.map(({ question, answer }, index) => (
            <div key={question} className={styles.item} data-open={openIndex === index}>
              <h3 className={styles.questionHeading}><button type="button" id={`faq-question-${index}`} className={styles.question} aria-expanded={openIndex === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenIndex(current => current === index ? null : index)}>
                <span className={styles.number} aria-hidden="true">{index + 1}</span>
                <span>{question}</span>
                <span className={styles.icon} aria-hidden="true" />
              </button></h3>
              <div id={`faq-answer-${index}`} className={styles.answerPanel} role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={openIndex !== index} inert={openIndex !== index}><div className={styles.answerClip}><div className={styles.answer}><p>{answer}</p></div></div></div>
            </div>
          ))}
        </div>
        <p className={styles.contact}>Still have a question? <Link href="/contact">Talk to our trade team <span aria-hidden="true">↗</span></Link></p>
      </div>
    </section>
  );
}
