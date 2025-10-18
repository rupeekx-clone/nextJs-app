'use client';

import { Container, Typography, Box, Paper, Divider, Alert, List, ListItem, ListItemText, Chip } from '@mui/material';

export default function RefundPolicyPage() {
  const sections = [
    { 
      title: "1. Overview", 
      content: "At RupeekX, we strive to provide excellent service and customer satisfaction. This Refund Policy outlines the circumstances under which refunds may be provided for our services. Please read this policy carefully before making any purchases or payments on our platform." 
    },
    { 
      title: "2. Refund Eligibility Conditions", 
      content: "Refunds may be considered under the following specific conditions:\n\n• Duplicate Payment: If you have been charged twice for the same service\n• Service Not Delivered: If the paid service was not provided within the promised timeframe\n• Technical Error: If payment was processed due to a technical error on our platform\n• Cancellation Within 48 Hours: If you cancel your membership card purchase within 48 hours of payment\n• Fraudulent Transaction: If the payment was made without your authorization\n\nAll refund requests must be submitted within 30 days of the original transaction date." 
    },
    { 
      title: "3. Non-Refundable Services", 
      content: "The following services and fees are generally non-refundable:\n\n• Membership card fees after 48 hours of purchase\n• Processing fees for loan applications\n• Document verification charges\n• Payment gateway charges\n• Services that have been partially or fully utilized\n• Fees for services where the user has received benefits\n• Charges for services that were clearly marked as non-refundable at the time of purchase\n\nPlease note that loan application processing fees are non-refundable as they cover the cost of credit assessment and processing." 
    },
    { 
      title: "4. Refund Process", 
      content: "To request a refund, please follow these steps:\n\n1. Contact our customer support team within 30 days of the transaction\n2. Provide the following information:\n   • Transaction ID or payment reference number\n   • Reason for refund request\n   • Supporting documentation (if applicable)\n3. Our team will review your request within 5-7 business days\n4. If approved, the refund will be processed within 10-15 business days\n5. You will receive confirmation via email once the refund is processed\n\nRefunds will be credited to the original payment method used for the transaction." 
    },
    { 
      title: "5. Refund Timeline", 
      content: "The refund process follows these timelines:\n\n• Refund Request Review: 5-7 business days\n• Refund Processing: 10-15 business days\n• Credit Card Refunds: 3-5 business days (after processing)\n• Bank Transfer Refunds: 5-7 business days (after processing)\n• UPI/Wallet Refunds: 1-3 business days (after processing)\n\nPlease note that actual credit to your account may take additional time depending on your bank or payment provider." 
    },
    { 
      title: "6. Partial Refunds", 
      content: "In certain circumstances, partial refunds may be provided:\n\n• If a service was partially delivered\n• If there was a pricing error that resulted in overcharging\n• If additional services were charged without consent\n• If there was a technical issue that affected service delivery\n\nPartial refund amounts will be calculated based on the unused portion of the service and any applicable terms." 
    },
    { 
      title: "7. Refund Denial", 
      content: "Refund requests may be denied in the following cases:\n\n• Request submitted after 30 days from transaction date\n• Service has been fully utilized or benefits received\n• User violated terms and conditions\n• Fraudulent or suspicious activity detected\n• Duplicate refund request for the same transaction\n• Insufficient documentation or information provided\n• Request does not meet eligibility criteria\n\nIf your refund request is denied, you will receive a detailed explanation of the reason." 
    },
    { 
      title: "8. Dispute Resolution", 
      content: "If you disagree with a refund decision, you may:\n\n• Request a review by our senior management team\n• Provide additional documentation to support your case\n• Escalate the matter through our customer support channels\n• Contact us at legal@rupeekx.com for legal disputes\n\nWe are committed to resolving all disputes fairly and transparently." 
    },
    { 
      title: "9. Contact Information for Refunds", 
      content: "For refund-related inquiries, please contact us:\n\n• Email: refunds@rupeekx.com\n• Phone: +91-70263-73808 (Mon-Fri, 9 AM - 6 PM)\n• Support Ticket: Submit through our 'Raise a Request' page\n• Address: 44, 3rd Floor, Vijayraj Society, Near Akshar Family Wear, Singanpore Causeway Road, Katargam, Surat, Gujarat, India - 395004\n\nPlease include your transaction details and reason for refund in your communication." 
    },
    { 
      title: "10. Changes to Refund Policy", 
      content: "We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting on our website. We will notify users of significant changes through:\n\n• Email notifications to registered users\n• Website announcements\n• Updated terms during login\n\nContinued use of our services after changes constitutes acceptance of the updated policy." 
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 5 }, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Typography variant="h3" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
          Refund Policy
        </Typography>
        
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4, fontStyle: 'italic' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Important:</strong> This refund policy applies to all services provided by RupeekX. Please read carefully before making any payments.
          </Typography>
        </Alert>

        <Box sx={{ mb: 4, p: 3, backgroundColor: 'success.light', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'success.dark' }}>
            Quick Refund Summary
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip label="48-Hour Cancellation Window" color="success" variant="outlined" />
            <Chip label="30-Day Request Period" color="success" variant="outlined" />
            <Chip label="5-7 Day Review Process" color="success" variant="outlined" />
            <Chip label="10-15 Day Processing" color="success" variant="outlined" />
          </Box>
          <Typography variant="body2" color="success.dark">
            Most refunds are processed within 15 business days of approval.
          </Typography>
        </Box>

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

        <Box sx={{ mt: 6, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            Refund Conditions Summary
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="✅ Refundable: Duplicate payments, service not delivered, technical errors"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="✅ Refundable: Membership card cancellation within 48 hours"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="❌ Non-refundable: Processing fees, document verification charges"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="❌ Non-refundable: Services that have been utilized or benefits received"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="⏰ Timeline: Request within 30 days, review in 5-7 days, process in 10-15 days"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
}
