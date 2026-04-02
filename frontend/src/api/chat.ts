import client from './client';
import type { ApiResponse } from '../types';

export interface ChatMsg {
  id: number;
  matchId: number;
  senderId: number;
  senderNickname: string;
  content: string;
  createdAt: string;
}

export interface EvalResult {
  id: number;
  matchId: number;
  targetId: number;
  communication: number;
  teamwork: number;
  mentality: number;
  averageScore: number;
}

export const chatApi = {
  getMessages: (matchId: number) =>
    client.get<ApiResponse<ChatMsg[]>>(`/api/chat/${matchId}/messages`),
};

export const evaluationApi = {
  submit: (matchId: number, scores: { communication: number; teamwork: number; mentality: number }) =>
    client.post<ApiResponse<EvalResult>>('/api/evaluation', { matchId, ...scores }),

  get: (matchId: number) =>
    client.get<ApiResponse<EvalResult | null>>(`/api/evaluation/${matchId}`),
};
