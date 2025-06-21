import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get authentication token from local storage
const getAuthToken = () => localStorage.getItem('authToken');

// Create axios instance with common headers
const api = axios.create({
  baseURL: API_BASE_URL
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page if unauthorized
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const login = async (userId: number, username: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { userId, username });
    
    if (response.status === 200 && response.data.success) {
      // Store auth token
      localStorage.setItem('authToken', response.data.token);
      return {
        success: true,
        user: response.data.user
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Authentication failed'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred during login'
    };
  }
};

export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        user: response.data.user
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Token verification failed'
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred during token verification'
    };
  }
};

// Subscription Plan APIs
export const getSubscriptionPlans = async (channelId: number) => {
  try {
    const response = await api.get(`/subscriptions/channel/${channelId}/plans`);
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        plans: response.data.plans
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Failed to fetch subscription plans'
    };
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching subscription plans'
    };
  }
};

export const createSubscriptionPlan = async (
  channelId: number,
  plan: {
    name: string;
    duration: string;
    price: string;
    description: string;
  }
) => {
  try {
    const response = await api.post(`/subscriptions/channel/${channelId}/plan`, plan);
    
    if (response.status === 201 && response.data.success) {
      return {
        success: true,
        plan: response.data.plan
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Failed to create subscription plan'
    };
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while creating the subscription plan'
    };
  }
};

export const updateSubscriptionPlan = async (
  channelId: number,
  planId: string,
  updates: {
    name?: string;
    duration?: string;
    price?: string;
    description?: string;
  }
) => {
  try {
    const response = await api.put(`/subscriptions/channel/${channelId}/plan/${planId}`, updates);
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        plan: response.data.plan
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Failed to update subscription plan'
    };
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while updating the subscription plan'
    };
  }
};

export const deleteSubscriptionPlan = async (channelId: number, planId: string) => {
  try {
    const response = await api.delete(`/subscriptions/channel/${channelId}/plan/${planId}`);
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Failed to delete subscription plan'
    };
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while deleting the subscription plan'
    };
  }
};

// Subscriber APIs
export const getChannelSubscribers = async (channelId: number) => {
  try {
    const response = await api.get(`/subscriptions/channel/${channelId}/subscribers`);
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        subscribers: response.data.subscribers
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Failed to fetch subscribers'
    };
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching subscribers'
    };
  }
};

export const getSubscriberDetails = async (channelId: number, memberId: string) => {
  try {
    const response = await api.get(`/subscriptions/channel/${channelId}/member/${memberId}`);
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        subscription: response.data.subscription,
        plan: response.data.plan
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Failed to fetch subscriber details'
    };
  } catch (error) {
    console.error('Error fetching subscriber details:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching subscriber details'
    };
  }
};

export const cancelSubscription = async (channelId: number, memberId: string) => {
  try {
    const response = await api.delete(`/subscriptions/channel/${channelId}/member/${memberId}`);
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Failed to cancel subscription'
    };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while cancelling the subscription'
    };
  }
};

// Channel APIs
export const getChannelData = async (channelId: number) => {
  try {
    const response = await api.get(`/channel/${channelId}`);
    
    if (response.status === 200) {
      return {
        success: true,
        channel: response.data
      };
    }
    
    return {
      success: false,
      message: response.data.error || 'Failed to fetch channel data'
    };
  } catch (error) {
    console.error('Error fetching channel data:', error);
    return {
      success: false,
      message: error.response?.data?.error || 'An error occurred while fetching channel data'
    };
  }
};

export const updateChannel = async (channelId: number, channelData: any) => {
  try {
    const response = await api.post(`/channel/${channelId}`, channelData);
    
    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message
      };
    }
    
    return {
      success: false,
      message: response.data.error || 'Failed to update channel'
    };
  } catch (error) {
    console.error('Error updating channel:', error);
    return {
      success: false,
      message: error.response?.data?.error || 'An error occurred while updating the channel'
    };
  }
};

// Analytics APIs
export const getSubscriptionAnalytics = async (channelId: number) => {
  try {
    const response = await api.get(`/subscriptions/channel/${channelId}/analytics`);
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        analytics: response.data.analytics
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Failed to fetch subscription analytics'
    };
  } catch (error) {
    console.error('Error fetching subscription analytics:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching subscription analytics'
    };
  }
};

// Transaction APIs
export const getTransactions = async (channelId: number) => {
  try {
    const response = await api.get(`/transactions/channel/${channelId}`);
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        transactions: response.data.transactions
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Failed to fetch transactions'
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while fetching transactions'
    };
  }
};

// User management APIs
export const getUserData = async (userId: number) => {
  try {
    const response = await api.get(`/user/${userId}`);
    
    if (response.status === 200) {
      return {
        success: true,
        user: response.data
      };
    }
    
    return {
      success: false,
      message: response.data.error || 'Failed to fetch user data'
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      success: false,
      message: error.response?.data?.error || 'An error occurred while fetching user data'
    };
  }
};

// Utility functions
export const processExpiredSubscriptions = async () => {
  try {
    const response = await api.post('/subscriptions/process-expired');
    
    if (response.status === 200 && response.data.success) {
      return {
        success: true,
        message: response.data.message,
        processedCount: response.data.processedCount
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Failed to process expired subscriptions'
    };
  } catch (error) {
    console.error('Error processing expired subscriptions:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred while processing expired subscriptions'
    };
  }
};

export default api;