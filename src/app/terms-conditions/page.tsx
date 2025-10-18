'use client';

import { Container, Typography, Box, Paper, Divider, List, ListItem, ListItemText, Alert } from '@mui/material';

export default function TermsConditionsPage() {
  const sections = [
    { 
      title: "1. Acceptance of Terms", 
      content: "By accessing and using Blumiq's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. These terms apply to all visitors, users, and others who access or use the service." 
    },
    { 
      title: "2. Description of Service", 
      content: "Blumiq is a financial technology platform that connects borrowers with lending partners. We provide:\n\n• Personal loan application and processing services\n• Business loan application and processing services\n• Membership card services for enhanced loan benefits\n• Document verification and processing assistance\n• Credit assessment and loan matching services\n\nWe act as an intermediary between borrowers and lending institutions, facilitating the loan application process but not providing loans directly." 
    },
    { 
      title: "3. Eligibility and User Accounts", 
      content: "To use our services, you must:\n\n• Be at least 18 years of age\n• Be a legal resident of India\n• Provide accurate and complete information\n• Maintain the confidentiality of your account credentials\n• Notify us immediately of any unauthorized use\n\nYou are responsible for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these terms." 
    },
    { 
      title: "4. Loan Application Process", 
      content: "When applying for loans through our platform:\n\n• You must provide accurate and complete information\n• We will share your information with our lending partners\n• Loan approval is subject to partner bank/NBFC criteria\n• We do not guarantee loan approval or specific terms\n• Interest rates and terms are determined by the lending partner\n• Processing fees may apply as disclosed during application\n\nYou understand that Blumiq facilitates the process but does not provide loans directly." 
    },
    { 
      title: "5. Membership Card Services", 
      content: "Our membership card services include:\n\n• Silver Membership Card: Enhanced personal loan benefits\n• Gold Membership Card: Business loan benefits up to ₹1 crore\n• Faster processing and priority support\n• Document assistance and verification\n• Exclusive offers from partner institutions\n\nMembership fees are non-refundable except as specified in our refund policy. Benefits are subject to terms of the lending partners." 
    },
    { 
      title: "6. Fees and Charges", 
      content: "Our fee structure includes:\n\n• Membership card fees (as displayed during purchase)\n• Processing fees for loan applications (if applicable)\n• Document verification charges (if applicable)\n• Payment gateway charges (as applicable)\n\nAll fees are clearly disclosed before you commit to any service. We reserve the right to modify fees with 30 days' notice." 
    },
    { 
      title: "7. Data Collection and Privacy", 
      content: "We collect and process your personal and financial information as described in our Privacy Policy. By using our services, you consent to:\n\n• Collection of personal, financial, and identity documents\n• Sharing information with lending partners for loan processing\n• Credit bureau checks and verification processes\n• Communication via phone, email, and SMS\n• Data retention as required by law and business needs" 
    },
    { 
      title: "8. User Responsibilities", 
      content: "You agree to:\n\n• Provide accurate and truthful information\n• Keep your account information updated\n• Not use the service for illegal or unauthorized purposes\n• Not attempt to gain unauthorized access to our systems\n• Not interfere with the proper functioning of the service\n• Comply with all applicable laws and regulations\n• Pay all applicable fees and charges promptly" 
    },
    { 
      title: "9. Prohibited Activities", 
      content: "You may not:\n\n• Provide false or misleading information\n• Use the service for money laundering or fraud\n• Attempt to circumvent security measures\n• Reverse engineer or copy our technology\n• Spam or send unsolicited communications\n• Violate any applicable laws or regulations\n• Interfere with other users' access to the service" 
    },
    { 
      title: "10. Intellectual Property Rights", 
      content: "All content, trademarks, logos, and intellectual property on our platform are owned by Blumiq or our licensors. You may not:\n\n• Copy, modify, or distribute our content without permission\n• Use our trademarks or logos without authorization\n• Create derivative works based on our platform\n• Remove or alter copyright notices\n\nYou retain ownership of the information you provide, but grant us license to use it for service provision." 
    },
    { 
      title: "11. Disclaimers and Limitations", 
      content: "Our services are provided 'as is' without warranties of any kind. We disclaim:\n\n• Warranties of merchantability or fitness for a particular purpose\n• Guarantees of loan approval or specific terms\n• Responsibility for lending partner decisions\n• Liability for third-party services or websites\n• Accuracy of information provided by third parties\n\nWe are not responsible for delays, errors, or failures in service provision beyond our reasonable control." 
    },
    { 
      title: "12. Limitation of Liability", 
      content: "To the maximum extent permitted by law, Blumiq shall not be liable for:\n\n• Indirect, incidental, or consequential damages\n• Loss of profits, data, or business opportunities\n• Damages exceeding the fees paid for our services\n• Actions or decisions of lending partners\n• Third-party content or services\n• System downtime or technical issues\n\nOur total liability shall not exceed the amount you paid for our services in the 12 months preceding the claim." 
    },
    { 
      title: "13. Indemnification", 
      content: "You agree to indemnify and hold harmless Blumiq, its officers, directors, employees, and agents from any claims, damages, or expenses arising from:\n\n• Your use of our services\n• Violation of these terms and conditions\n• Violation of any third-party rights\n• Your provision of false or misleading information\n• Your failure to comply with applicable laws" 
    },
    { 
      title: "14. Termination", 
      content: "Either party may terminate this agreement at any time:\n\n• You may stop using our services at any time\n• We may suspend or terminate your account for violations\n• We may discontinue services with reasonable notice\n• Termination does not affect accrued rights and obligations\n• Provisions regarding liability, indemnification, and dispute resolution survive termination" 
    },
    { 
      title: "15. Dispute Resolution", 
      content: "Any disputes arising from these terms shall be resolved through:\n\n• Good faith negotiations between the parties\n• Mediation if negotiations fail\n• Arbitration under the Arbitration and Conciliation Act, 2015\n• Jurisdiction of courts in Surat, Gujarat\n• Governing law of India\n\nYou waive the right to participate in class action lawsuits or class-wide arbitration." 
    },
    { 
      title: "16. Force Majeure", 
      content: "We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to:\n\n• Natural disasters, pandemics, or government actions\n• Internet or telecommunications failures\n• Acts of war, terrorism, or civil unrest\n• Changes in laws or regulations\n• Actions of third-party service providers" 
    },
    { 
      title: "17. Severability", 
      content: "If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. We will replace invalid provisions with valid ones that achieve the same objective." 
    },
    { 
      title: "18. Entire Agreement", 
      content: "These terms, together with our Privacy Policy and other referenced policies, constitute the entire agreement between you and Blumiq regarding the use of our services. They supersede all prior agreements and understandings." 
    },
    { 
      title: "19. Changes to Terms", 
      content: "We reserve the right to modify these terms at any time. We will notify you of material changes by:\n\n• Posting updated terms on our website\n• Sending email notifications to registered users\n• Displaying notices on our platform\n\nContinued use of our services after changes constitutes acceptance of the new terms. If you disagree with changes, you must stop using our services." 
    },
    { 
      title: "20. Contact Information", 
      content: "For questions about these Terms & Conditions, contact us:\n\n• Email: legal@blumiq.com\n• Phone: +91-70263-73808\n• Address: 44, 3rd Floor, Vijayraj Society, Near Akshar Family Wear, Singanpore Causeway Road, Katargam, Surat, Gujarat, India - 395004\n\nWe will respond to your inquiries within 5 business days." 
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 5 }, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Typography variant="h3" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
          Terms & Conditions
        </Typography>
        
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4, fontStyle: 'italic' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Important:</strong> Please read these terms carefully before using our services. By using Blumiq, you agree to be bound by these terms and conditions.
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

        <Box sx={{ mt: 6, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            Key Points Summary
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
                primary="You must be 18+ and provide accurate information"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Loan approval depends on partner bank/NBFC criteria"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Membership fees are non-refundable except as specified"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="We share your information with lending partners for processing"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Disputes are resolved through arbitration in Surat, Gujarat"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
}
