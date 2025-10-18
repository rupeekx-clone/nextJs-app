'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  initialValue?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  disabled?: boolean;
  clearable?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  initialValue = '',
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  disabled = false,
  clearable = true,
}) => {
  const [query, setQuery] = useState(initialValue);

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchQuery: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSearch(searchQuery);
        }, debounceMs);
      };
    })(),
    [onSearch, debounceMs]
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Effect to update query when initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      // Trigger immediate search on Enter
      onSearch(query);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth={fullWidth}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        size={size}
        variant={variant}
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: clearable && query && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
