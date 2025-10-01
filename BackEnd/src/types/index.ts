export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  provider: string;
  createdAt: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface FootballTeam {
  id: number;
  name: string;
  logo: string;
  founded?: number;
  country?: string;
  venue?: {
    id: number;
    name: string;
    capacity: number;
    city: string;
  };
}

export interface FootballStanding {
  rank: number;
  team: FootballTeam;
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
}

export interface FootballMatch {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
    };
  };
  teams: {
    home: FootballTeam;
    away: FootballTeam;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface FavoriteTeam {
  id: string;
  userId: string;
  teamId: number;
  teamName: string;
  createdAt: string;
}