'use client';

import React from 'react';
import { Box, Pagination as MuiPagination, Typography, FormControl, Select, MenuItem } from '@mui/material';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  showInfo?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'standard';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 25, 50, 100],
  showInfo = true,
  size = 'medium',
  color = 'primary',
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleItemsPerPageChange = (event: any) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(Number(event.target.value));
    }
  };

  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 2,
      py: 2
    }}>
      {/* Items Info */}
      {showInfo && (
        <Typography variant="body2" color="text.secondary">
          Showing {startItem} to {endItem} of {totalItems} entries
        </Typography>
      )}

      {/* Items Per Page Selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Show:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              variant="outlined"
            >
              {itemsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            entries
          </Typography>
        </Box>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          size={size}
          color={color}
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
        />
      )}
    </Box>
  );
};

export default Pagination;
