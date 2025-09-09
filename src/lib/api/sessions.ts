import axios, { AxiosError } from 'axios';
// import { log } from 'console';

const API_BASE_URL = 'http://localhost:8000';

export interface Session {
  id: string;
  title: string;
  created_at: string;
}

export interface SessionsList {
  sessions: Session[];
}

// Get all sessions for the current user
export async function getSessions(): Promise<Session[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/sessions/`, {
      withCredentials: true,
    });
    return response.data.sessions;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail: string }>;
    console.error('Error fetching sessions:', axiosError.response?.data || axiosError.message);
    throw new Error(axiosError.response?.data?.detail || 'Failed to fetch sessions');
  }
}

// Create a new session
export async function createSession(title: string): Promise<{ message: string; session_id: string }> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sessions/create`,
      { title },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail: string }>;
    console.error('Error creating session:', axiosError.response?.data || axiosError.message);
    throw new Error(axiosError.response?.data?.detail || 'Failed to create session');
  }
}

// Update session title
export async function updateSessionTitle(sessionId: string, title: string): Promise<{ message: string }> {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/sessions/${sessionId}`,
      { title },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail: string }>;
    console.error('Error updating session:', axiosError.response?.data || axiosError.message);
    throw new Error(axiosError.response?.data?.detail || 'Failed to update session');
  }
}

// Delete a session
export async function deleteSession(sessionId: string): Promise<{ message: string }> {
  try {
    console.log('Starting delete for session:', sessionId);
    const response = await axios.delete(
      `${API_BASE_URL}/sessions/${sessionId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail: string }>;
    console.error('Error deleting session:', axiosError.response?.data || axiosError.message);
    throw new Error(axiosError.response?.data?.detail || 'Failed to delete session');
  }
}
