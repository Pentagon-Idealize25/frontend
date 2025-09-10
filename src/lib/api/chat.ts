// Updated API function
import axios from 'axios';

export interface ApiMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export async function createMessage(message: {
  session_id: string;
  sender: 'user' | 'bot';
  content: string;
  reply_to_id?: string;
}): Promise<void> {
  console.log("Creating message:", message);
  try {
    await axios.post('http://localhost:8000/messages/addMessage', {
      session_id: message.session_id,
      sender: message.sender,
      content: message.content,
      reply_to_id: message.reply_to_id || null,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create message';
    console.error('API Error:', errorMessage);
    
    // Handle axios errors specifically
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { detail?: string } } };
      const detail = axiosError.response?.data?.detail || 'Failed to create message';
      throw new Error(detail);
    }
    
    throw new Error(errorMessage);
  }
}