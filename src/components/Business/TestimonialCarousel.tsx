'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, IconButton, Avatar } from '@mui/material';
import { ChevronLeft, ChevronRight, Star } from '@mui/icons-material';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Box sx={{ position: 'relative', maxWidth: 800, mx: 'auto' }}>
      {/* Testimonial Card */}
      <Card
        sx={{
          p: 3,
          textAlign: 'center',
          minHeight: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <CardContent>
          {/* Stars */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                sx={{
                  color: index < currentTestimonial.rating ? '#ffd700' : '#e0e0e0',
                  fontSize: 24,
                }}
              />
            ))}
          </Box>

          {/* Testimonial Text */}
          <Typography
            variant="body1"
            sx={{
              fontStyle: 'italic',
              mb: 3,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: 'text.secondary',
            }}
          >
            "{currentTestimonial.text}"
          </Typography>

          {/* Customer Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Avatar
              src={currentTestimonial.avatar}
              sx={{
                width: 60,
                height: 60,
                backgroundColor: '#1976d2',
              }}
            >
              {currentTestimonial.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {currentTestimonial.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentTestimonial.location}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Navigation Arrows */}
      {testimonials.length > 1 && (
        <>
          <IconButton
            onClick={goToPrevious}
            sx={{
              position: 'absolute',
              left: -60,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            onClick={goToNext}
            sx={{
              position: 'absolute',
              right: -60,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {testimonials.length > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
            gap: 1,
          }}
        >
          {testimonials.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? '#1976d2' : '#e0e0e0',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: index === currentIndex ? '#1565c0' : '#bdbdbd',
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TestimonialCarousel;
