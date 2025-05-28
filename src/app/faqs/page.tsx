'use client'; // Can be client or server, but client if we add specific interactions later

import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import the icon

export default function FaqsPage() {
  const faqs = [
    {
      question: "What is a personal loan?",
      answer: "A personal loan is an unsecured loan that you can use for various purposes like debt consolidation, home renovation, medical emergencies, travel, etc. Repayment is typically made in fixed monthly installments over a predetermined period."
    },
    {
      question: "What are the eligibility criteria for a personal loan?",
      answer: "Eligibility criteria usually include factors like your age, income, credit score, employment status (salaried or self-employed), and existing financial obligations. Specific criteria can vary between lenders."
    },
    {
      question: "How much loan amount can I get?",
      answer: "The loan amount you can get depends on your eligibility, primarily your income and repayment capacity. Lenders will assess this based on the documents you provide."
    },
    {
      question: "What documents are required for a loan application?",
      answer: "Common documents include proof of identity (Aadhaar, PAN card), proof of address, income proof (salary slips, bank statements, ITR for self-employed), and photographs. The exact list may vary."
    },
    {
      question: "How long does it take to get a loan approved?",
      answer: "With Rupeekx and our partners, we aim for quick approvals. Personal loans can be approved in as little as 30 minutes, and business loans within 48 hours, provided all documentation is complete and criteria are met."
    },
    {
      question: "Is my data safe with Rupeekx?",
      answer: "Yes, we prioritize the security and privacy of your data. We use industry-standard encryption and security protocols to protect your information. Please refer to our Privacy Policy for more details."
    },
     {
      question: "What are Rupeekx Membership Cards?",
      answer: "Rupeekx Membership Cards (Silver and Gold) offer exclusive benefits, including access to pre-approved loan offers from multiple banks and NBFCs, faster processing, and potentially better loan terms. Each card has different features tailored to personal or business loan needs."
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 5} }}>
        Frequently Asked Questions
      </Typography>
      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}> {/* Constrain width of accordions */}
        {faqs.map((faq, index) => (
          <Accordion 
            key={index} 
            defaultExpanded={index === 0} 
            sx={{ 
              mb: 1.5, 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Softer shadow
              '&:before': { display: 'none' }, // Remove the default top border/line
              '&.Mui-expanded': { // More specific selector for expanded state
                margin: '16px 0', // Add more margin when expanded for separation
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
              sx={{ 
                backgroundColor: index % 2 === 0 ? 'grey.50' : 'grey.100', // Alternating summary background
                minHeight: 56, // Ensure consistent height
                '& .MuiAccordionSummary-content': { // Target content area for margin
                  margin: '12px 0',
                },
                '&.Mui-expanded': { // When expanded
                  minHeight: 56,
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: 'background.paper', borderTop: '1px solid rgba(0, 0, 0, .125)', p: 2.5 /* More padding */ }}>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}
