'use client';

import { Container, Typography, Box, Paper, Divider, Alert, List, ListItem, ListItemText } from '@mui/material';

export default function DisclaimerPage() {
  const sections = [
    { 
      title: "1. General Information Disclaimer", 
      content: "The information contained on this website (Blumiq) is for general information purposes only. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk." 
    },
    { 
      title: "2. Loan Facilitation Disclaimer", 
      content: "Blumiq is a loan facilitation platform and does not directly provide loans. We act as an intermediary between borrowers and lending institutions. Important disclaimers include:\n\n• We do not guarantee loan approval or specific loan terms\n• Interest rates, processing fees, and loan terms are determined by our lending partners\n• Loan approval is subject to the lending partner's credit assessment criteria\n• We are not responsible for lending partner decisions or policies\n• Processing times may vary based on lending partner requirements\n• We facilitate the application process but do not control the final loan terms" 
    },
    { 
      title: "3. Financial Advice Disclaimer", 
      content: "The information provided on this website does not constitute financial advice, investment advice, or any other type of advice. You should not treat any of the website's content as such. Before making any financial decisions, you should:\n\n• Consult with qualified financial advisors\n• Consider your personal financial situation\n• Review all terms and conditions carefully\n• Understand all fees and charges involved\n• Assess your ability to repay any loan obligations\n\nWe recommend seeking professional financial advice before making any significant financial decisions." 
    },
    { 
      title: "4. Interest Rate and Fee Disclaimer", 
      content: "Interest rates and fees displayed on our website are indicative and subject to change without notice. Final rates and fees are determined by our lending partners based on:\n\n• Your credit profile and history\n• Income and employment stability\n• Loan amount and tenure requested\n• Documentation provided\n• Lending partner's current policies\n\nActual rates may differ from those displayed. All final terms will be communicated during the loan approval process." 
    },
    { 
      title: "5. Document and Information Accuracy", 
      content: "While we strive to provide accurate and up-to-date information, we cannot guarantee the accuracy, completeness, or timeliness of all information on our website. Users are responsible for:\n\n• Verifying all information before making decisions\n• Ensuring document accuracy and completeness\n• Updating personal information as needed\n• Complying with lending partner requirements\n• Understanding all terms and conditions\n\nWe reserve the right to correct errors and update information without prior notice." 
    },
    { 
      title: "6. Third-Party Services Disclaimer", 
      content: "Our website may contain links to third-party websites, services, or applications. We are not responsible for:\n\n• The content, privacy policies, or practices of third-party sites\n• The accuracy or reliability of third-party information\n• Any transactions or interactions with third parties\n• Third-party service availability or performance\n• Any damages arising from third-party services\n\nYour use of third-party services is at your own risk and subject to their terms and conditions." 
    },
    { 
      title: "7. Technical and System Disclaimer", 
      content: "We strive to maintain high system availability, but we cannot guarantee uninterrupted service. We disclaim responsibility for:\n\n• System downtime or technical failures\n• Data loss or corruption\n• Security breaches beyond our reasonable control\n• Internet connectivity issues\n• Browser compatibility problems\n• Mobile app performance issues\n\nWe recommend keeping backups of important information and using secure internet connections." 
    },
    { 
      title: "8. Regulatory and Compliance Disclaimer", 
      content: "Our services are subject to applicable laws and regulations in India. Important considerations include:\n\n• We comply with RBI guidelines for loan facilitation\n• All lending partners are regulated financial institutions\n• We follow data protection and privacy laws\n• Our services are subject to regulatory changes\n• Users must comply with applicable tax laws\n• We reserve the right to modify services to maintain compliance\n\nUsers are responsible for understanding and complying with applicable laws." 
    },
    { 
      title: "9. Limitation of Liability", 
      content: "To the maximum extent permitted by law, Blumiq shall not be liable for:\n\n• Any direct, indirect, incidental, or consequential damages\n• Loss of profits, data, or business opportunities\n• Damages arising from loan rejection or delays\n• Third-party actions or decisions\n• System failures or technical issues\n• Force majeure events\n\nOur total liability shall not exceed the fees paid for our services in the preceding 12 months." 
    },
    { 
      title: "10. Changes to This Disclaimer", 
      content: "We reserve the right to update this disclaimer at any time. Changes will be effective immediately upon posting on our website. We may notify users of significant changes through:\n\n• Email notifications to registered users\n• Website announcements\n• Mobile app notifications\n• Updated terms during login\n\nContinued use of our services after changes constitutes acceptance of the updated disclaimer." 
    },
    { 
      title: "11. Contact Information", 
      content: "If you have any questions about this disclaimer or need clarification on any points, please contact us:\n\n• Email: legal@blumiq.com\n• Phone: +91-70263-73808\n• Address: 44, 3rd Floor, Vijayraj Society, Near Akshar Family Wear, Singanpore Causeway Road, Katargam, Surat, Gujarat, India - 395004\n\nWe will respond to your inquiries within 3 business days." 
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 5 }, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Typography variant="h3" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
          Legal Disclaimer
        </Typography>
        
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4, fontStyle: 'italic' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Important:</strong> Please read this disclaimer carefully. By using Blumiq services, you acknowledge that you have read, understood, and agree to be bound by this disclaimer.
          </Typography>
        </Alert>

        <Divider sx={{ mb: 4 }} />

        {sections.map((section, index) => (
          <Box key={index} sx={{ mb: index === sections.length - 1 ? 0 : 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              {section.title}
            </Typography>
            <Typography variant="body1" paragraph sx={{ 
              lineHeight: 1.8, 
              textAlign: 'justify', 
              whiteSpace: 'pre-line',
              fontSize: '1rem'
            }}>
              {section.content}
            </Typography>
            {index < sections.length - 1 && <Divider sx={{ mt: 3 }} />}
          </Box>
        ))}

        <Box sx={{ mt: 6, p: 3, backgroundColor: 'warning.light', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'warning.dark' }}>
            Key Disclaimers Summary
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Blumiq is a loan facilitation platform, not a direct lender"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="We do not guarantee loan approval or specific terms"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Interest rates and fees are determined by lending partners"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Information on our website is for general purposes only"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="We are not responsible for third-party services or decisions"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Users should seek professional financial advice when needed"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
}
