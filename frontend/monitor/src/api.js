const API_BASE_URL = 'http://localhost:8080';

export async function getAllMonitors() {
  const response = await fetch(`${API_BASE_URL}/api/urlmonitor/allrecords`);
  return response.json();
}

export async function addMonitor(monitor) {
  const response = await fetch(`${API_BASE_URL}/api/urlmonitor/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(monitor),
  });
  return response.json();
}

export async function updateMonitor(monitor) {
  const response = await fetch(`${API_BASE_URL}/api/urlmonitor/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(monitor),
  });
  return response.json();
}

export async function deleteMonitor(monitor) {
  const response = await fetch(`${API_BASE_URL}/api/urlmonitor/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(monitor),
  });
  return response.json();
}