'use client';

import React, { useState } from 'react';
import { Box, Tabs as MuiTabs, Tab, Typography } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabItem {
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: number;
  onChange?: (newValue: number) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  orientation?: 'horizontal' | 'vertical';
  centered?: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab = 0,
  onChange,
  variant = 'standard',
  orientation = 'horizontal',
  centered = false,
}) => {
  const [value, setValue] = useState(defaultTab);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <MuiTabs
          value={value}
          onChange={handleChange}
          variant={variant}
          orientation={orientation}
          centered={centered}
          aria-label="tabs"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              disabled={tab.disabled}
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
            />
          ))}
        </MuiTabs>
      </Box>
      
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default Tabs;
