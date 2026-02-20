import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - redirect to login');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (username: string, email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/signup', {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const statesAPI = {
  getStates: async () => {
    try {
      const response = await apiClient.get('/states');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStateDetails: async (stateId: string) => {
    try {
      const response = await apiClient.get(`/states/${stateId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const postsAPI = {
  getPosts: async () => {
    try {
      const response = await apiClient.get('/posts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPost: async (formData: FormData) => {
    try {
      const response = await apiClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  likePost: async (postId: string) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  commentOnPost: async (postId: string, comment: string) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/comment`, {
        comment,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const chatbotAPI = {
  sendMessage: async (message: string) => {
    try {
      const response = await apiClient.post('/chatbot/message', { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTravelPlan: async (destination: string, budget: string, duration: string) => {
    try {
      const response = await apiClient.post('/chatbot/travel-plan', {
        destination,
        budget,
        duration,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const mapAPI = {
  getTouristSpots: async (latitude: number, longitude: number, radius: number) => {
    try {
      const response = await apiClient.get('/map/tourist-spots', {
        params: { latitude, longitude, radius },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRestaurants: async (latitude: number, longitude: number, radius: number) => {
    try {
      const response = await apiClient.get('/map/restaurants', {
        params: { latitude, longitude, radius },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const profileAPI = {
  getProfile: async (userId: string) => {
    try {
      const response = await apiClient.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userId: string, data: any) => {
    try {
      const response = await apiClient.put(`/profile/${userId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSavedPlans: async (userId: string) => {
    try {
      const response = await apiClient.get(`/profile/${userId}/saved-plans`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;
