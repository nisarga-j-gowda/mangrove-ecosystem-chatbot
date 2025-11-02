
export type MessageRole = 'user' | 'model';

export interface TextMessage {
  id: string;
  role: MessageRole;
  type: 'text';
  content: string;
}

export interface ImageMessage {
  id: string;
  role: MessageRole;
  type: 'image';
  images: { src: string; alt: string; label?: string }[];
}

export interface ButtonMessage {
  id: string;
  role: MessageRole;
  type: 'button';
  label: string;
  onClick: () => void;
}

export type ChatMessage = TextMessage | ImageMessage | ButtonMessage;
