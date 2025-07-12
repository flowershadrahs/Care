import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

export default function DoctorTable({ doctors, onEdit, onDelete }) {
  const columns = [
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1,
      valueGetter: (params) => {
        // Add null safety check
        return params.row?.department?.name || 'No Department';
      },
    },
    {
      field: 'specializations',
      headerName: 'Specializations',
      flex: 1,
      renderCell: (params) => (
        <div className="flex gap-2">
          {params.row?.specializations?.length > 0 ? (
            params.row.specializations.map(spec => (
              <span key={spec.id} className="badge badge-info">
                {spec.specialization?.name || 'Unknown'}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No specializations</span>
          )}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton
            onClick={() => onEdit(params.row)}
            className="btn btn-outline"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => onDelete(params.row.id)}
            className="btn btn-danger"
          >
            <Delete />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="table" style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={doctors || []}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        className="custom-scrollbar"
        loading={!doctors}
        noRowsOverlay={() => (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No doctors found</p>
          </div>
        )}
      />
    </div>
  );
}