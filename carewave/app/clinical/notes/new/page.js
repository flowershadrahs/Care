'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClinicalNote } from '@/services/clinicalService';

export default function ClinicalNoteNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    note: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClinicalNote(formData);
      router.push('/clinical');
    } catch (error) {
      console.error('Error creating clinical note:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">New Clinical Note</h1>
      <form onSubmit={handleSubmit} className="bg-hospital-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium text-hospital-gray-700">Patient ID</label>
          <input
            type="text"
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            className="mt-1 block w-full rounded-md border-hospital-gray-300 shadow-sm focus:border-hospital-accent focus:ring focus:ring-hospital-accent focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-hospital-gray-700">Doctor ID</label>
          <input
            type="text"
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            className="mt-1 block w-full rounded-md border-hospital-gray-300 shadow-sm focus:border-hospital-accent focus:ring focus:ring-hospital-accent focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-hospital-gray-700">Note</label>
          <textarea
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="mt-1 block w-full rounded-md border-hospital-gray-300 shadow-sm focus:border-hospital-accent focus:ring focus:ring-hospital-accent focus:ring-opacity-50"
            rows="5"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-hospital-accent text-white px-4 py-2 rounded"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => router.push('/clinical')}
            className="bg-hospital-gray-200 text-hospital-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
