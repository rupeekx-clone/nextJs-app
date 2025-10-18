'use client';

import { Container, Typography } from '@mui/material';
import FAQAccordion from '@/components/Business/FAQAccordion';

export default function FaqsPage() {
  const faqs = [
    // Personal Loan FAQs
    {
      id: '1',
      question: "What is a personal loan?",
      answer: "A personal loan is an unsecured loan that you can use for various purposes like debt consolidation, home renovation, medical emergencies, travel, etc. Repayment is typically made in fixed monthly installments over a predetermined period.",
      category: "Personal Loan"
    },
    {
      id: '2',
      question: "Where can a personal loan be used?",
      answer: "Personal loans can be used for various purposes including debt consolidation, home renovation, medical emergencies, wedding expenses, vacation, education, or any other personal financial need.",
      category: "Personal Loan"
    },
    {
      id: '3',
      question: "What is the eligibility for a personal loan?",
      answer: "Eligibility criteria usually include factors like your age (21-65 years), income (minimum ₹15,000 per month for salaried), credit score (650+), employment status, and existing financial obligations. Specific criteria can vary between lenders.",
      category: "Personal Loan"
    },
    {
      id: '4',
      question: "What is the EMI for 1 lakh in personal loan?",
      answer: "EMI for ₹1 lakh personal loan depends on interest rate and tenure. For example, at 12% interest for 2 years, EMI would be approximately ₹4,707. Use our EMI calculator for accurate calculations.",
      category: "Personal Loan"
    },
    {
      id: '5',
      question: "Which bank has the lowest interest rate for personal loan?",
      answer: "Interest rates vary based on your profile and creditworthiness. With RupeekX, we help you get the best rates from multiple banks. Rates typically start from 10.25% per annum.",
      category: "Personal Loan"
    },
    {
      id: '6',
      question: "How can I get a low interest personal loan?",
      answer: "To get a low interest personal loan: maintain a good credit score (750+), have a stable income, keep low debt-to-income ratio, compare offers from multiple lenders, and consider a co-applicant if needed.",
      category: "Personal Loan"
    },
    {
      id: '7',
      question: "How to apply for a personal loan?",
      answer: "Apply online through RupeekX: 1) Fill the application form, 2) Upload required documents, 3) Get instant approval, 4) Sign the loan agreement, 5) Receive funds in your account.",
      category: "Personal Loan"
    },
    {
      id: '8',
      question: "What credit score is required for a personal loan?",
      answer: "Most lenders require a minimum credit score of 650-700 for personal loans. A score of 750+ gets you the best interest rates and terms.",
      category: "Personal Loan"
    },
    {
      id: '9',
      question: "What CIBIL score is required for a personal loan?",
      answer: "A CIBIL score of 650+ is generally required for personal loan approval. Higher scores (750+) qualify for better interest rates and loan terms.",
      category: "Personal Loan"
    },
    {
      id: '10',
      question: "How long will it take for my Personal loan to be processed?",
      answer: "With RupeekX, personal loans can be approved and disbursed within 30 minutes to 24 hours, provided all documentation is complete and eligibility criteria are met.",
      category: "Personal Loan"
    },
    {
      id: '11',
      question: "Can my CIBIL Score affect my loan sanction?",
      answer: "Yes, your CIBIL score significantly impacts loan approval and interest rates. A higher score increases approval chances and gets you better terms.",
      category: "Personal Loan"
    },

    // Business Loan FAQs
    {
      id: '12',
      question: "What is a Business loan?",
      answer: "A business loan is financing provided to businesses for various purposes like working capital, expansion, equipment purchase, inventory, or other business needs. It can be secured or unsecured.",
      category: "Business Loan"
    },
    {
      id: '13',
      question: "Where can a business loan be used?",
      answer: "Business loans can be used for working capital, business expansion, equipment purchase, inventory management, marketing, hiring, or any legitimate business purpose.",
      category: "Business Loan"
    },
    {
      id: '14',
      question: "What is the eligibility for a business loan?",
      answer: "Eligibility includes: business vintage (minimum 1 year), annual turnover, profit margins, credit score, business plan, and financial statements. Requirements vary by lender and loan amount.",
      category: "Business Loan"
    },
    {
      id: '15',
      question: "What is the EMI for 1 lakh in business loan?",
      answer: "EMI for ₹1 lakh business loan depends on interest rate and tenure. For example, at 11.5% interest for 3 years, EMI would be approximately ₹3,300. Use our EMI calculator for accurate calculations.",
      category: "Business Loan"
    },
    {
      id: '16',
      question: "Which bank has the lowest interest rate for business loans?",
      answer: "Interest rates vary based on business profile, creditworthiness, and loan amount. With RupeekX, we help you get the best rates from multiple lenders. Rates typically start from 11.5% per annum.",
      category: "Business Loan"
    },
    {
      id: '17',
      question: "How can I get a low interest business loan?",
      answer: "To get a low interest business loan: maintain good business credit, show consistent revenue growth, keep proper financial records, have a solid business plan, and compare offers from multiple lenders.",
      category: "Business Loan"
    },
    {
      id: '18',
      question: "How to Apply for a business loan?",
      answer: "Apply through RupeekX: 1) Fill business loan application, 2) Submit business documents, 3) Get pre-approval, 4) Complete verification, 5) Sign agreement and receive funds.",
      category: "Business Loan"
    },
    {
      id: '19',
      question: "What credit score is required for a business loan?",
      answer: "Business loans typically require a credit score of 650+ for the business owner. Higher scores get better interest rates and terms.",
      category: "Business Loan"
    },
    {
      id: '20',
      question: "What CIBIL score is required for a business loan?",
      answer: "A CIBIL score of 650+ is generally required for business loan approval. Higher scores (750+) qualify for better interest rates and loan terms.",
      category: "Business Loan"
    },
    {
      id: '21',
      question: "How long will it take for my business loan to be processed?",
      answer: "With RupeekX, business loans can be approved and disbursed within 48 hours to 7 business days, depending on loan amount and documentation completeness.",
      category: "Business Loan"
    },
    {
      id: '22',
      question: "Can my CIBIL Score affect my business loan sanction?",
      answer: "Yes, your CIBIL score significantly impacts business loan approval and interest rates. A higher score increases approval chances and gets you better terms.",
      category: "Business Loan"
    },
    {
      id: '23',
      question: "What are the documents required for Instant Business Loan?",
      answer: "Required documents include: Business registration certificate, PAN card, GST certificate, bank statements (6 months), ITR (2 years), business plan, and identity/address proof.",
      category: "Business Loan"
    },

    // Membership Card FAQs
    {
      id: '24',
      question: "What is Rupeekx membership card?",
      answer: "RupeekX membership cards (Silver and Gold) provide exclusive access to pre-approved loan offers from multiple banks and NBFCs, faster processing, better interest rates, and dedicated customer support.",
      category: "Membership Card"
    },
    {
      id: '25',
      question: "What is the step for buying a membership card?",
      answer: "Steps to buy membership card: 1) Choose Silver or Gold card, 2) Make payment online, 3) Receive card details via email, 4) Start applying for loans immediately.",
      category: "Membership Card"
    },
    {
      id: '26',
      question: "Which type of membership card should I buy?",
      answer: "Choose Silver card for personal loans up to ₹15 lakhs, or Gold card for business loans up to ₹1 crore. Both offer 4-year validity and exclusive benefits.",
      category: "Membership Card"
    },
    {
      id: '27',
      question: "What is benefit of buying Membership card?",
      answer: "Benefits include: Access to multiple lenders, faster loan processing, better interest rates, 4-year validity, referral earnings up to 30%, and dedicated customer support.",
      category: "Membership Card"
    }
  ];

  const categories = ["Personal Loan", "Business Loan", "Membership Card"];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 5} }}>
        Frequently Asked Questions
      </Typography>
      
      <FAQAccordion 
        faqs={faqs} 
        categories={categories}
        defaultCategory="all"
      />
    </Container>
  );
}
