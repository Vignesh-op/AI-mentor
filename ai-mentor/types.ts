export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isLoading?: boolean;
}

export enum AppMode {
  MENTOR = 'mentor',
  MOCK_INTERVIEW = 'mock_interview',
  PLACEMENT_PREP = 'placement_prep',
}

export interface ChatSessionConfig {
  mode: AppMode;
  systemInstruction?: string;
  initialMessage?: string;
}

export interface PrepFormData {
  company: string;
  role: string;
  experienceLevel: string;
}
