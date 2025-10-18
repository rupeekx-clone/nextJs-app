'use client';

import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Popover, Paper } from '@mui/material';
import { DateRange, CalendarToday } from '@mui/icons-material';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  presets?: DateRangePreset[];
}

interface DateRangePreset {
  label: string;
  getValue: () => { startDate: Date; endDate: Date };
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  label = 'Date Range',
  placeholder = 'Select date range',
  disabled = false,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  presets = [],
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = event.target.value ? new Date(event.target.value) : null;
    onDateChange(newStartDate, endDate);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value ? new Date(event.target.value) : null;
    onDateChange(startDate, newEndDate);
  };

  const handlePresetClick = (preset: DateRangePreset) => {
    const { startDate: presetStart, endDate: presetEnd } = preset.getValue();
    onDateChange(presetStart, presetEnd);
    handleClose();
  };

  const formatDateRange = () => {
    if (!startDate && !endDate) return placeholder;
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    };

    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `From ${formatDate(startDate)}`;
    } else if (endDate) {
      return `Until ${formatDate(endDate)}`;
    }
    
    return placeholder;
  };

  const defaultPresets: DateRangePreset[] = [
    {
      label: 'Today',
      getValue: () => {
        const today = new Date();
        return { startDate: today, endDate: today };
      },
    },
    {
      label: 'Yesterday',
      getValue: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return { startDate: yesterday, endDate: yesterday };
      },
    },
    {
      label: 'Last 7 days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: 'Last 30 days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: 'This month',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { startDate: start, endDate: end };
      },
    },
    {
      label: 'Last month',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const end = new Date(now.getFullYear(), now.getMonth(), 0);
        return { startDate: start, endDate: end };
      },
    },
  ];

  const allPresets = [...defaultPresets, ...presets];

  return (
    <Box>
      <Button
        onClick={handleClick}
        disabled={disabled}
        fullWidth={fullWidth}
        variant="outlined"
        size={size}
        startIcon={<CalendarToday />}
        sx={{
          justifyContent: 'flex-start',
          textTransform: 'none',
          color: 'text.primary',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        <Typography variant="body2" sx={{ textAlign: 'left', flex: 1 }}>
          {formatDateRange()}
        </Typography>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { minWidth: 320, p: 2 }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Presets */}
          {allPresets.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Quick Select
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {allPresets.map((preset, index) => (
                  <Button
                    key={index}
                    size="small"
                    variant="outlined"
                    onClick={() => handlePresetClick(preset)}
                    sx={{ textTransform: 'none' }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Date Inputs */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Custom Range
            </Typography>
            
            <TextField
              label="Start Date"
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={handleStartDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            
            <TextField
              label="End Date"
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={handleEndDateChange}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button size="small" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              size="small" 
              variant="contained"
              onClick={() => {
                onDateChange(null, null);
                handleClose();
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default DateRangePicker;
