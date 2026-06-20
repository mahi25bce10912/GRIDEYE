// Vercel par environment variable "VITE_API_URL" set karein: https://grideye-production.up.railway.app
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://grideye-production.up.railway.app';

export const getPrediction = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Prediction API failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error in getPrediction:", error);
    throw error;
  }
};

export const getActiveEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events`);
    if (!response.ok) throw new Error(`Events GET API failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error in getActiveEvents:", error);
    throw error;
  }
};

export const createEvent = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Events POST API failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error in createEvent:", error);
    throw error;
  }
};
