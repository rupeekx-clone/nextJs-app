'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  categories?: string[];
  defaultCategory?: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  faqs,
  categories,
  defaultCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory || 'all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setExpandedItems([]); // Collapse all items when changing category
  };

  const handleItemToggle = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <Box>
      {/* Category Filter */}
      {categories && categories.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Box
              onClick={() => handleCategoryChange('all')}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: selectedCategory === 'all' ? '#1976d2' : '#f5f5f5',
                color: selectedCategory === 'all' ? 'white' : 'text.primary',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: selectedCategory === 'all' ? '#1565c0' : '#e0e0e0',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                All
              </Typography>
            </Box>
            {categories.map((category) => (
              <Box
                key={category}
                onClick={() => handleCategoryChange(category)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: selectedCategory === category ? '#1976d2' : '#f5f5f5',
                  color: selectedCategory === category ? 'white' : 'text.primary',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: selectedCategory === category ? '#1565c0' : '#e0e0e0',
                  },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {category}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* FAQ Items */}
      <Box>
        {filteredFAQs.map((faq) => (
          <Accordion
            key={faq.id}
            expanded={expandedItems.includes(faq.id)}
            onChange={() => handleItemToggle(faq.id)}
            sx={{
              mb: 1,
              '&:before': {
                display: 'none',
              },
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '8px !important',
              '&.Mui-expanded': {
                margin: '0 0 8px 0',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px 8px 0 0',
                '&.Mui-expanded': {
                  borderRadius: '8px 8px 0 0',
                },
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'medium',
                  color: '#1976d2',
                  fontSize: '1rem',
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: 'white',
                borderRadius: '0 0 8px 8px',
                pt: 2,
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {filteredFAQs.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No FAQs found for the selected category.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FAQAccordion;
