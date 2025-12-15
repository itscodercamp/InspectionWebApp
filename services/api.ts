
import { VehicleFormData, VehicleImages, ApiVehicle } from '../types';

// API Configuration
const API_HOST = 'https://apis.trustedvehicles.com'; 
const BASE_URL = API_HOST;

export const getMediaUrl = (path?: string | null) => {
  // Return placeholder if path is missing, empty, or string "null"/"undefined"
  if (!path || path === 'null' || path === 'undefined') {
    const svg = `
    <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#f8fafc"/>
      <path d="M140 130 C140 130 150 110 170 110 C190 110 200 130 200 130" stroke="#cbd5e1" stroke-width="4" fill="transparent"/>
      <circle cx="250" cy="100" r="15" fill="#cbd5e1" opacity="0.5"/>
      <path d="M100 220 L160 160 L210 210 L260 160 L320 220 V250 H100 Z" fill="#e2e8f0"/>
      <text x="200" y="270" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">No Image</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim().replace(/\n/g, ' '))}`;
  }
  
  // If it's already a full URL or data URI, return as is
  if (path.startsWith('http') || path.startsWith('https') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  // Clean up path and construct absolute URL
  // Remove leading slash from path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Ensure host ends with slash
  const host = API_HOST.endsWith('/') ? API_HOST : `${API_HOST}/`;
  
  return `${host}${cleanPath}`;
};

// Helper to get auth headers
const getHeaders = (isMultipart = false) => {
  const headers: HeadersInit = {};
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

/**
 * UTILITY: Serializes the Form Data and Images into a standard FormData object
 * capable of being sent via POST/PUT request.
 */
const serializeVehicleData = (data: VehicleFormData, images: VehicleImages): FormData => {
  const formData = new FormData();
  const debugObj: Record<string, any> = {};

  // 1. Append Text Data
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    // Convert boolean to string "true"/"false" for FormData
    let finalValue = value;
    if (typeof value === 'boolean') {
      finalValue = value ? 'true' : 'false';
    } else {
      finalValue = String(value);
    }

    formData.append(key, finalValue as string);
    debugObj[key] = finalValue;
  });

  // 2. Append Images/Files
  Object.entries(images).forEach(([key, file]) => {
    if (file instanceof File) {
      formData.append(key, file);
      debugObj[key] = `File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }
  });

  // --- DEBUG LOGGING (Matches your Final Parameter List) ---
  console.group('📦 API Payload (Debug)');
  console.log(`Target: ${API_HOST}/api/marketplace/vehicles`);
  console.log('Text Fields:', Object.keys(data).length);
  console.log('Files Attached:', Object.keys(images).filter(k => images[k] instanceof File).length);
  console.table(debugObj);
  console.groupEnd();
  // ---------------------

  return formData;
};

export const api = {
  /**
   * Authenticate Employee
   * Endpoint: POST /api/login
   */
  login: async (email: string, password: string): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token if provided in response
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Fetch all live vehicles
   * Endpoint: GET /api/marketplace/vehicles
   */
  getVehicles: async (): Promise<ApiVehicle[]> => {
    try {
      const response = await fetch(`${BASE_URL}/api/marketplace/vehicles`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch vehicles error:', error);
      throw error;
    }
  },

  /**
   * Fetch single vehicle by ID
   * Endpoint: GET /api/marketplace/vehicles/:id
   */
  getVehicleById: async (id: string): Promise<ApiVehicle> => {
    try {
      const response = await fetch(`${BASE_URL}/api/marketplace/vehicles/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Vehicle not found');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch vehicle details error:', error);
      throw error;
    }
  },

  /**
   * Create a new vehicle listing
   * Endpoint: POST /api/marketplace/vehicles
   * Expects: Multipart/Form-Data
   */
  addVehicle: async (data: VehicleFormData, images: VehicleImages, onProgress?: (percent: number) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/api/marketplace/vehicles`);
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(xhr.responseText || 'Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error occurred during upload'));

      const formData = serializeVehicleData(data, images);
      xhr.send(formData);
    });
  },

  /**
   * Update an existing vehicle
   * Endpoint: PATCH /api/marketplace/vehicles/:id
   */
  updateVehicle: async (id: string, data: VehicleFormData, images: VehicleImages, onProgress?: (percent: number) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PATCH', `${BASE_URL}/api/marketplace/vehicles/${id}`);
      
      const token = localStorage.getItem('auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(xhr.responseText || 'Update failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error occurred during update. Please check your connection or CORS settings.'));

      const formData = serializeVehicleData(data, images);
      xhr.send(formData);
    });
  }
};
