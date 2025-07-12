// components/patients/PatientList.js
"use client";

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { Search, Add, Edit, Delete } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/patients?search=${encodeURIComponent(search)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Check if response has error property
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }
      
      // Map and validate patient data
      const validatedPatients = data.map((patient) => {
        if (!patient || typeof patient !== 'object') {
          console.warn('Invalid patient data:', patient);
          return null;
        }
        
        return {
          id: patient.id || '',
          firstName: patient.firstName || '',
          lastName: patient.lastName || '',
          email: patient.email || '',
          dateOfBirth: patient.dateOfBirth || '',
          gender: patient.gender || '',
          phone: patient.phone || '',
          createdAt: patient.createdAt || '',
          updatedAt: patient.updatedAt || '',
          userId: patient.userId || null
        };
      }).filter(Boolean); // Remove null entries
      
      setPatients(validatedPatients);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      setError(error.message);
      setPatients([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.warn('No patient ID provided for deletion');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to delete patient: ${response.status}`);
        }
        
        // Remove patient from local state instead of refetching
        setPatients(prevPatients => prevPatients.filter(patient => patient.id !== id));
      } catch (error) {
        console.error('Failed to delete patient:', error);
        alert(`Failed to delete patient: ${error.message}`);
      }
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '-';
    
    try {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) return '-';
      
      const today = new Date();
      const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
      return age >= 0 ? age : '-';
    } catch (error) {
      console.warn('Error calculating age:', error);
      return '-';
    }
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 120,
      sortable: true 
    },
    { 
      field: 'firstName', 
      headerName: 'First Name', 
      width: 150,
      sortable: true 
    },
    { 
      field: 'lastName', 
      headerName: 'Last Name', 
      width: 150,
      sortable: true 
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 200,
      sortable: true 
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 100,
      sortable: true,
      valueGetter: (params) => {
        // Safe destructuring with fallback
        const row = params?.row || params;
        return calculateAge(row?.dateOfBirth);
      },
    },
    { 
      field: 'gender', 
      headerName: 'Gender', 
      width: 100,
      sortable: true 
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      width: 150,
      sortable: true 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        // Safe destructuring with fallback
        const row = params?.row || params;
        const patientId = row?.id;
        
        if (!patientId) {
          return null;
        }
        
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              color="primary"
              onClick={() => router.push(`/patients/edit/${patientId}`)}
              size="small"
              title="Edit Patient"
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDelete(patientId)}
              size="small"
              title="Delete Patient"
            >
              <Delete />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: '100%', overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Patients
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/patients/new')}
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          New Patient
        </Button>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>
      
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error" variant="body2">
            Error: {error}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => fetchPatients()}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Box>
      )}
      
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={patients}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            sx={{
              '& .MuiDataGrid-cell': { py: 1 },
              '& .MuiDataGrid-columnHeaders': { bgcolor: 'grey.100' },
              '& .MuiDataGrid-row:hover': { bgcolor: 'grey.50' },
              minHeight: 400,
            }}
            loading={loading}
            localeText={{
              noRowsLabel: 'No patients found',
              errorOverlayDefaultLabel: 'An error occurred while loading patients',
            }}
          />
        )}
      </Box>
    </Box>
  );
}