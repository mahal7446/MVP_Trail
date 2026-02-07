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

// ============== PROFILE API ==============

export interface ProfileData {
  email: string;
  fullName: string;
  phone: string;
  address?: string;
  profilePictureUrl?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  user?: T;
}

/**
 * Fetch user profile data
 */
export const getProfile = async (email: string): Promise<ApiResponse<ProfileData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/get?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch profile data'
    };
  }
};

/**
 * Update user profile information
 */
export const updateProfile = async (email: string, profileData: Partial<ProfileData>): Promise<ApiResponse<ProfileData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        ...profileData
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update profile'
    };
  }
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (email: string, file: File): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/profile/upload-picture`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Failed to upload profile picture'
    };
  }
};

/**
 * Get full profile picture URL
 */
export const getProfilePictureUrl = (profilePictureUrl?: string | null): string => {
  if (!profilePictureUrl) return '';
  if (profilePictureUrl.startsWith('http')) return profilePictureUrl;
  return `${API_BASE_URL}${profilePictureUrl}`;
};

