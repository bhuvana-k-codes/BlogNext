const API_BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('blognest_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data;
};

export const authAPI = {
  register: async (name, email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return handleResponse(res);
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};

export const postsAPI = {
  getAll: async (topic = 'All') => {
    const url = topic && topic !== 'All' 
      ? `${API_BASE_URL}/posts?topic=${encodeURIComponent(topic)}` 
      : `${API_BASE_URL}/posts`;
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  create: async (postData) => {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(postData)
    });
    return handleResponse(res);
  },

  update: async (id, postData) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(postData)
    });
    return handleResponse(res);
  },

  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  toggleSave: async (id) => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}/save`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};

export const commentsAPI = {
  getByPost: async (postId) => {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  create: async (postId, content) => {
    const res = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    return handleResponse(res);
  }
};

export const userAPI = {
  getSavedPosts: async () => {
    const res = await fetch(`${API_BASE_URL}/user/saved-posts`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  addRecentlyViewed: async (postId) => {
    const res = await fetch(`${API_BASE_URL}/user/recently-viewed/${postId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    return handleResponse(res);
  },

  getRecentlyViewed: async () => {
    const res = await fetch(`${API_BASE_URL}/user/recently-viewed`, {
      headers: getHeaders()
    });
    return handleResponse(res);
  }
};
