import React, { useState } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

const OngoingProject = () => {
  const [summary, setSummary] = useState('');
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('zipfile', file);

    try {
      setUploading(true);
      const response = await axios.post('/api/convert-code', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSummary(response.data.summary);
    } catch (err) {
      console.error('Upload failed:', err);
      setSummary('❌ Failed to convert code.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-2xl bg-gray-100 p-8 rounded-lg shadow-md border border-yellow-500">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              Ongoing Project
            </h2>

            <p className="mb-6 text-black">
              Upload a ZIP file of your project, and we'll generate a summary
              including folder structure, languages used, and setup instructions.
            </p>

            <div className="mb-4">
              <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="w-full rounded bg-white text-gray-800 px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-500 file:text-black hover:file:bg-yellow-600"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded transition duration-200"
            >
              {uploading ? 'Converting...' : 'Convert Code to Text'}
            </button>

            {summary && (
              <div className="mt-8 pt-5">
                <h3 className="text-xl font-semibold text-yellow-300 mb-2">Project Summary</h3>
                <div className="max-h-96 overflow-y-auto whitespace-pre-wrap bg-gray-100 border border-yellow-500 rounded p-4 text-sm text-black">
                  {summary}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default OngoingProject;
