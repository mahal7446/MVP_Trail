/**
 * API configuration and client functions
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface PredictionResponse {
  success: boolean;
  diseaseName: string;
  confidence: number;
  cropName: string;
  severity: "Low" | "Medium" | "High";
  allPredictions?: Array<{
    disease: string;
    confidence: number;
  }>;
  description: string;
  error?: string;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

/**
 * Check if the backend API is healthy and model is loaded
 */
export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json();
};

/**
 * Predict plant disease from an image file
 */
export const predictDisease = async (imageFile: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};
