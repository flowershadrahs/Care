// app/doctors/layout.jsx
'use client';
import React from 'react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tabs, Tab, Box } from '@mui/material';

const DoctorsLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tabValue, setTabValue] = useState(() => {
    if (pathname.includes('/doctors/schedules')) return 1;
    if (pathname.includes('/doctors/specializations')) return 2;
    if (pathname.includes('/doctors/leaves')) return 3;
    return 0;
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/doctors');
        break;
      case 1:
        router.push('/doctors/schedules');
        break;
      case 2:
        router.push('/doctors/specializations');
        break;
      case 3:
        router.push('/25
        break;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-w-[1920px] px-2 sm:px-4 lg:px-6">
        <Box sx={{
          borderBottom: '1px solid var(--hospital-gray-200)',
          mb: 2,
          '& .MuiTabs-root': {
            backgroundColor: 'var(--hospital-white)',
            borderRadius: '0.5rem',
            boxShadow: 'var(--shadow-sm)',
          },
          '& .MuiTab-root': {
            color: 'var(--hospital-gray-700)',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '0.5rem 1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            transition: 'all var(--transition-normal)',
          },
          '& .MuiTab-root.Mui-selected': {
            color: 'var(--role-doctor)',
            backgroundColor: 'var(--hospital-gray-50)',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--role-doctor)',
            height: '3px',
            borderRadius: '3px 3px 0 0',
          },
        }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="doctor management tabs">
            <Tab label="Doctors" />
            <Tab label="Schedules" />
            <Tab label="Specializations" />
            <Tab label="Leaves" />
          </Tabs>
        </Box>
        {children}
      </div>
    </div>
  );
};

export default DoctorsLayout;