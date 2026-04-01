import client from './client';
import type { ApiResponse } from '../types';

export interface ProfileData {
  id: number;
  userId: number;
  nickname: string;
  profileImage: string | null;
  mannerScore: number;
  mannerTier: string;
  serverName: string;
  serverType: string;
  serverRegion: string;
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
}

export interface ProfilePayload {
  serverName: string;
  serverType: string;
  serverRegion: string;
  jobClass: string;
  jobTier: string;
  baseLevel: number;
  role: string;
  contentPreference: string;
  lookingFor: string;
  experienceLevel: string;
  guildName?: string;
  voiceChat: string;
  playTimeStart: string;
  playTimeEnd: string;
  bio: string;
}

export const profileApi = {
  create: (data: ProfilePayload) =>
    client.post<ApiResponse<ProfileData>>('/api/profile', data),

  update: (data: ProfilePayload) =>
    client.put<ApiResponse<ProfileData>>('/api/profile/me', data),

  getMe: () =>
    client.get<ApiResponse<ProfileData>>('/api/profile/me'),

  getUser: (userId: number) =>
    client.get<ApiResponse<ProfileData>>(`/api/profile/${userId}`),
};
