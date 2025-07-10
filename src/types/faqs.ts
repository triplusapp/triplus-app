export interface FaqCategory {
    name: string;
    faqs: Faq[];
}

export interface Faq {
    question: string;
    answer: string;
}
