// Types para a aplicação Rodadex

export interface User {
  id: number;
  name: string;
  email: string;
  provider: string;
  createdAt: string;
}

export interface Favorite {
  id: number;
  userId: number;
  teamId: number;
  teamName: string;
  createdAt: string;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  code?: string;
  country?: string;
  founded?: number;
}

export interface Fixture {
  id: number;
  date: string;
  timestamp: number;
  status: {
    long: string;
    short: string;
    elapsed?: number;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: Team;
    away: Team;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}