'use client';

import { Container, Typography, Box, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';

export default function PrivacyPolicyPage() {
  const sections = [
    { 
      title: "1. Introduction", 
      content: "RupeekX ('we', 'our', or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site." 
    },
    { 
      title: "2. Information We Collect", 
      content: "We collect information you provide directly to us, such as when you create an account, apply for a loan, or contact us for support. This may include:\n\n• Personal Information: Name, email address, phone number, date of birth, PAN number, Aadhaar number\n• Financial Information: Income details, bank statements, employment information, credit history\n• Identity Documents: PAN card, Aadhaar card, bank statements, salary slips, ITR documents\n• Communication Data: Records of your communications with us, including support requests and feedback\n• Usage Data: Information about how you use our website and services, including IP address, browser type, and device information" 
    },
    { 
      title: "3. How We Use Your Information", 
      content: "We use the information we collect to:\n\n• Process your loan applications and provide financial services\n• Verify your identity and assess creditworthiness\n• Communicate with you about your applications and our services\n• Improve our website and services\n• Comply with legal and regulatory requirements\n• Prevent fraud and ensure security\n• Send you important updates and notifications" 
    },
    { 
      title: "4. Information Sharing and Disclosure", 
      content: "We may share your information in the following circumstances:\n\n• With our banking and financial partners for loan processing\n• With third-party service providers who assist us in operating our business\n• When required by law or to protect our rights and interests\n• In connection with a business transfer or acquisition\n• With your explicit consent\n\nWe do not sell, trade, or rent your personal information to third parties for marketing purposes." 
    },
    { 
      title: "5. Data Security", 
      content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:\n\n• Encryption of sensitive data in transit and at rest\n• Regular security assessments and updates\n• Access controls and authentication mechanisms\n• Secure data storage and backup procedures\n• Employee training on data protection practices" 
    },
    { 
      title: "6. Data Retention", 
      content: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. We will securely delete or anonymize your information when it is no longer needed." 
    },
    { 
      title: "7. Your Rights", 
      content: "You have the following rights regarding your personal information:\n\n• Access: Request access to your personal information\n• Correction: Request correction of inaccurate or incomplete information\n• Deletion: Request deletion of your personal information (subject to legal requirements)\n• Portability: Request a copy of your data in a structured format\n• Objection: Object to certain processing of your information\n• Withdrawal of Consent: Withdraw consent where processing is based on consent\n\nTo exercise these rights, please contact us using the information provided in the Contact Us section." 
    },
    { 
      title: "8. Cookies and Tracking Technologies", 
      content: "We use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small text files stored on your device that help us:\n\n• Remember your preferences and settings\n• Analyze website traffic and usage patterns\n• Provide personalized content and advertisements\n• Improve website functionality and performance\n\nYou can control cookie settings through your browser preferences." 
    },
    { 
      title: "9. Third-Party Links", 
      content: "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit." 
    },
    { 
      title: "10. Children's Privacy", 
      content: "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information." 
    },
    { 
      title: "11. International Data Transfers", 
      content: "Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information." 
    },
    { 
      title: "12. Changes to This Policy", 
      content: "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website and updating the 'Last Updated' date. Your continued use of our services after such changes constitutes acceptance of the updated policy." 
    },
    { 
      title: "13. Contact Us", 
      content: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:\n\n• Email: privacy@rupeekx.com\n• Phone: +91-70263-73808\n• Address: 44, 3rd Floor, Vijayraj Society, Near Akshar Family Wear, Singanpore Causeway Road, Katargam, Surat, Gujarat, India - 395004\n\nWe will respond to your inquiries within 30 days of receipt." 
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 5 }, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Typography variant="h3" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
          Privacy Policy
        </Typography>
        
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4, fontStyle: 'italic' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

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
            Quick Summary
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="We collect only necessary information for loan processing"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Your data is protected with bank-level security"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="We never sell your personal information"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="You have full control over your data"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Container>
  );
}
