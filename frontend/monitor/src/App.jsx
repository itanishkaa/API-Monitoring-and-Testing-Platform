import React, { useEffect, useState } from 'react';
import { Activity, Plus } from 'lucide-react';
import { MonitorForm } from './components/MonitorForm';
import { MonitorList } from './components/MonitorList';
import * as api from './api';

function App() {
  const [monitors, setMonitors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMonitor, setEditingMonitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonitors = async () => {
    try {
      const data = await api.getAllMonitors();
      setMonitors(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch monitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (monitor) => {
    try {
      if (editingMonitor) {
        await api.updateMonitor(monitor);
      } else {
        await api.addMonitor(monitor);
      }
      fetchMonitors();
      setShowForm(false);
      setEditingMonitor(null);
    } catch (err) {
      setError('Failed to save monitor');
    }
  };

  const handleEdit = (monitor) => {
    setEditingMonitor(monitor);
    setShowForm(true);
  };

  const handleDelete = async (monitor) => {
    if (window.confirm('Are you sure you want to delete this monitor?')) {
      try {
        await api.deleteMonitor(monitor);
        fetchMonitors();
      } catch (err) {
        setError('Failed to delete monitor');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">URL Monitor</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Monitor
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {showForm ? (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <MonitorForm
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingMonitor(null);
                }}
                initialData={editingMonitor || undefined}
              />
            </div>
          ) : null}

          <div className="bg-white shadow rounded-lg">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading...</div>
            ) : monitors.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No monitors added yet. Click "Add Monitor" to get started.
              </div>
            ) : (
              <MonitorList
                monitors={monitors}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;