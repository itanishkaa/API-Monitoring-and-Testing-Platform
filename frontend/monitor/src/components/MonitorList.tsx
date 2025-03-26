import React from 'react';
import { Edit2, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { UrlMonitor } from '../types';

interface MonitorListProps {
  monitors: UrlMonitor[];
  onEdit: (monitor: UrlMonitor) => void;
  onDelete: (monitor: UrlMonitor) => void;
}

export function MonitorList({ monitors, onEdit, onDelete }: MonitorListProps) {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'UP':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'DOWN':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Response Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Checked
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {monitors.map((monitor) => (
            <tr key={monitor.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusIcon(monitor.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{monitor.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={monitor.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  {monitor.url}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {monitor.responseTime ? `${monitor.responseTime}ms` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {monitor.lastChecked ? new Date(monitor.lastChecked).toLocaleString() : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => onEdit(monitor)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(monitor)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}