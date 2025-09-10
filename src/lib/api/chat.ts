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
    let errorMessage = 'Failed to create message';

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.detail || error.message;
      console.error('API Error:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }

    throw new Error(errorMessage);
  }
}