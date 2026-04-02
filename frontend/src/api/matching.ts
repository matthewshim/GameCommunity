import client from './client';
import type { ApiResponse } from '../types';

export interface Candidate {
  userId: number;
  nickname: string;
  profileImage: string | null;
  mannerScore: number;
  mannerTier: string;
  serverName: string;
  serverType: string;
  jobClass: string;
  jobTier: string;
  baseLevel: number;
  role: string;
  contentPreference: string[];
  lookingFor: string;
  experienceLevel: string;
  guildName: string | null;
  voiceChat: string;
  playTimeStart: string;
  playTimeEnd: string;
  bio: string;
  matchScore: number;
}

export interface SwipeResult {
  matched: boolean;
  matchId: number | null;
  message: string;
}

export interface MatchInfo {
  matchId: number;
  partnerId: number;
  partnerNickname: string;
  partnerProfileImage: string | null;
  partnerJobClass: string | null;
  partnerServerName: string | null;
  status: string;
  matchedAt: string;
}

export const matchingApi = {
  getCandidates: (limit = 20) =>
    client.get<ApiResponse<Candidate[]>>(`/api/matching/candidates?limit=${limit}`),

  swipe: (targetUserId: number, type: 'GG' | 'PASS') =>
    client.post<ApiResponse<SwipeResult>>('/api/swipe', { targetUserId, type }),

  getMatches: () =>
    client.get<ApiResponse<MatchInfo[]>>('/api/matches'),
};
