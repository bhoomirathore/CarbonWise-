export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Assessment {
  id: string;
  userId: string;
  createdAt: string;
  // Future sprint scores (optional for now)
  transportScore?: number;
  energyScore?: number;
  foodScore?: number;
  wasteScore?: number;
  totalEmissions?: number;
  carbonwiseScore?: number;
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
