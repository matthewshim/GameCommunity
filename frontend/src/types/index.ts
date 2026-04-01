export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  mannerScore: number;
  mannerTier: string;
  hasProfile: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  errorCode: string | null;
}
