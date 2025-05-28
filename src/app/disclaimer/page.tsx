'use client';

import { Container, Typography, Box, Paper } from '@mui/material';

export default function DisclaimerPage() {
  const PlaceholderText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst.";
  const ShortPlaceholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.";

  const sections = [
    { title: "1. General Information Disclaimer", content: PlaceholderText },
    { title: "2. Accuracy of Information", content: PlaceholderText },
    { title: "3. Financial Advice Disclaimer", content: ShortPlaceholder },
    { title: "4. External Links Disclaimer", content: PlaceholderText },
    { title: "5. Limitation of Liability", content: PlaceholderText },
    { title: "6. Changes to This Disclaimer", content: "We may update this Disclaimer from time to time. We will notify you of any changes by posting the new Disclaimer on this page. You are advised to review this Disclaimer periodically for any changes. Changes to this Disclaimer are effective when they are posted on this page." },
    { title: "7. Contact Us", content: "If you have any questions about this Disclaimer, you can contact us:\n- By email: info@example.com\n- By visiting this page on our website: [Your Contact Page Link]\n- By phone number: [Your Phone Number]" }
  ];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 5 }, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Typography variant="h3" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
          Disclaimer
        </Typography>
        
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 4, fontStyle: 'italic' }}>
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        {sections.map((section, index) => (
          <Box key={index} sx={{ mb: index === sections.length - 1 ? 0 : 3.5 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
              {section.title}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.75, textAlign: 'justify', whiteSpace: 'pre-line' }}>
              {section.content}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Container>
  );
}
