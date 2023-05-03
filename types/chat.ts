import { OpenAIModel } from './openai';

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user' | 'system';

export interface ChatBody {
  model: OpenAIModel;
  messages: Message[];
  prompt: string;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  model: OpenAIModel;
  prompt: string;
  folderId: string | null;
}

export interface GooglePromp {
  prompt: string;
}
