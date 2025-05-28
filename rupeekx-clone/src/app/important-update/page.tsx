'use client';

import { Container, Typography, Box, Paper, Divider } from '@mui/material';

export default function ImportantUpdatePage() {
  const updates = [
    {
      date: "October 26, 2023",
      title: "Scheduled System Maintenance on Oct 28th",
      content: "Please be advised that we will be performing scheduled system maintenance on October 28th, 2023, from 2:00 AM to 4:00 AM IST. During this time, access to online loan applications and customer portals may be temporarily unavailable. We apologize for any inconvenience this may cause and appreciate your understanding as we work to improve our services."
    },
    {
      date: "September 15, 2023",
      title: "New Branch Opening in South Bangalore",
      content: "We are excited to announce the opening of our new branch in South Bangalore, extending our services closer to you. Visit us at [New Branch Address] starting October 1st, 2023. We look forward to serving you there!"
    }
    // Add more updates here if needed, or leave empty to test the "no updates" message
  ];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, sm: 4, md:5} }}>
        Important Updates
      </Typography>
      
      {updates.length > 0 ? (
        <Box>
          {updates.map((update, index) => (
            <Paper 
              key={index} 
              elevation={2} 
              sx={{ 
                p: {xs: 2, sm: 2.5, md:3}, // Responsive padding
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)' // Softer shadow
              }}
            >
              <Typography 
                variant="caption" 
                display="block" 
                color="text.secondary" 
                gutterBottom 
                sx={{fontSize: '0.8rem'}} // Slightly smaller date
              >
                Posted on: {update.date}
              </Typography>
              <Typography 
                variant="h5" // Title size
                component="h2" 
                gutterBottom 
                sx={{ fontWeight: 'medium', mb: 1 }} // Adjusted margin for title
              >
                {update.title}
              </Typography>
              <Divider sx={{my:1.5}} /> {/* Divider between title and content */}
              <Typography 
                variant="body1" 
                paragraph // Adds bottom margin
                sx={{ 
                  lineHeight: 1.75, // Improved line height
                  mb:0 // Remove default paragraph bottom margin if Paper provides enough
                }}
              >
                {update.content}
              </Typography>
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper 
          elevation={1} 
          sx={{
            p:{xs: 2, sm:3, md:4}, 
            textAlign: 'center', 
            backgroundColor: 'grey.50', // Lighter background for the message
            borderRadius: 2
          }}
        >
            <Typography variant="h6" component="p" sx={{fontWeight:'normal'}}>
                No important updates at this time. Please check back later.
            </Typography>
        </Paper>
      )}
    </Container>
  );
}
