export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  created_at: string;
  
  transport_type: string;
  transport_distance: number;
  energy_usage: string;
  diet_type: string;
  waste_habit: string;
  
  total_score: number;
  transport_score: number;
  energy_score: number;
  diet_score: number;
  waste_score: number;
  impact_level: string;
}

export interface AuthState {
  user: {
    id: string;
    email?: string;
    createdAt: string;
  } | null;
  session: {
    accessToken: string;
    expiresAt?: number;
  } | null;
  isLoading: boolean;
}
