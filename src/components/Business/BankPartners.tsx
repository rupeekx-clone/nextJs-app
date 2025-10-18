'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import Image from 'next/image';

interface BankPartner {
  id: string;
  name: string;
  logo_url?: string;
}

interface BankPartnersProps {
  partners: BankPartner[];
  title?: string;
  subtitle?: string;
}

const BankPartners: React.FC<BankPartnersProps> = ({
  partners,
  title = "Our Bank & NBFC Partners",
  subtitle = "We are partnered with leading banks and NBFCs to provide you with the best loan options"
}) => {
  // Default bank logos (you can replace these with actual logos)
  const defaultLogos: Record<string, string> = {
    'SBI': '/sbi-state-bank-of-india-seeklogo.png',
    'HDFC': '/hdfc-bank-seeklogo.png',
    'ICICI': '/icici-bank-seeklogo.png',
    'Axis': '/axis-bank-seeklogo.png',
    'Kotak': '/kotak-mahindra-bank-seeklogo.png',
    'Yes Bank': '/yes-bank-seeklogo.png',
    'IDFC First': '/idfc-first-bank-seeklogo.png',
    'Indian Bank': '/indian-bank-1907-seeklogo.png',
  };

  return (
    <Box sx={{ py: 6, backgroundColor: '#f8f9fa' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#1976d2',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          {subtitle}
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {partners.map((partner) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={partner.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderColor: '#1976d2',
                },
              }}
            >
              <CardContent sx={{ p: 1, textAlign: 'center' }}>
                {partner.logo_url || defaultLogos[partner.name] ? (
                  <Box
                    sx={{
                      width: 80,
                      height: 60,
                      position: 'relative',
                      mx: 'auto',
                      mb: 1,
                    }}
                  >
                    <Image
                      src={partner.logo_url || defaultLogos[partner.name] || '/placeholder-bank.png'}
                      alt={partner.name}
                      fill
                      style={{
                        objectFit: 'contain',
                        filter: 'grayscale(100%)',
                        transition: 'filter 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'grayscale(0%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'grayscale(100%)';
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 80,
                      height: 60,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 'bold',
                        color: '#666',
                        textAlign: 'center',
                      }}
                    >
                      {partner.name}
                    </Typography>
                  </Box>
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                  }}
                >
                  {partner.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {partners.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Bank partners information will be displayed here.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BankPartners;
