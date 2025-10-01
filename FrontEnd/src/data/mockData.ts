// Dados mock para demonstração quando o backend não estiver disponível

export const mockFixtures = [
  {
    id: 1,
    date: "2025-09-29T15:30:00Z",
    timestamp: 1727619000,
    status: {
      long: "Not Started",
      short: "NS",
      elapsed: null
    },
    league: {
      id: 71,
      name: "Serie A",
      country: "Brazil",
      logo: "https://media.api-sports.io/football/leagues/71.png",
      flag: "https://media.api-sports.io/flags/br.svg",
      season: 2025,
      round: "Regular Season - 28"
    },
    teams: {
      home: {
        id: 131,
        name: "Corinthians",
        logo: "https://media.api-sports.io/football/teams/131.png"
      },
      away: {
        id: 127,
        name: "Flamengo",
        logo: "https://media.api-sports.io/football/teams/127.png"
      }
    },
    goals: {
      home: null,
      away: null
    },
    score: {
      halftime: {
        home: null,
        away: null
      },
      fulltime: {
        home: null,
        away: null
      }
    }
  },
  {
    id: 2,
    date: "2025-09-29T18:00:00Z",
    timestamp: 1727628000,
    status: {
      long: "Match Finished",
      short: "FT",
      elapsed: 90
    },
    league: {
      id: 71,
      name: "Serie A",
      country: "Brazil",
      logo: "https://media.api-sports.io/football/leagues/71.png",
      flag: "https://media.api-sports.io/flags/br.svg",
      season: 2025,
      round: "Regular Season - 27"
    },
    teams: {
      home: {
        id: 124,
        name: "Palmeiras",
        logo: "https://media.api-sports.io/football/teams/124.png"
      },
      away: {
        id: 128,
        name: "São Paulo",
        logo: "https://media.api-sports.io/football/teams/128.png"
      }
    },
    goals: {
      home: 2,
      away: 1
    },
    score: {
      halftime: {
        home: 1,
        away: 0
      },
      fulltime: {
        home: 2,
        away: 1
      }
    }
  },
  {
    id: 3,
    date: "2025-09-30T20:30:00Z",
    timestamp: 1727723400,
    status: {
      long: "Not Started",
      short: "NS",
      elapsed: null
    },
    league: {
      id: 71,
      name: "Serie A",
      country: "Brazil",
      logo: "https://media.api-sports.io/football/leagues/71.png",
      flag: "https://media.api-sports.io/flags/br.svg",
      season: 2025,
      round: "Regular Season - 28"
    },
    teams: {
      home: {
        id: 153,
        name: "Atlético Mineiro",
        logo: "https://media.api-sports.io/football/teams/153.png"
      },
      away: {
        id: 131,
        name: "Corinthians",
        logo: "https://media.api-sports.io/football/teams/131.png"
      }
    },
    goals: {
      home: null,
      away: null
    },
    score: {
      halftime: {
        home: null,
        away: null
      },
      fulltime: {
        home: null,
        away: null
      }
    }
  }
];

export const mockStandings = [
  {
    rank: 1,
    team: {
      id: 124,
      name: "Palmeiras",
      logo: "https://media.api-sports.io/football/teams/124.png"
    },
    points: 67,
    goalsDiff: 25,
    group: "Serie A",
    form: "WWWDW",
    status: "same",
    description: "Promotion - Copa Libertadores (Group Stage)",
    all: {
      played: 27,
      win: 20,
      draw: 7,
      lose: 0,
      goals: {
        for: 52,
        against: 27
      }
    },
    home: {
      played: 14,
      win: 11,
      draw: 3,
      lose: 0,
      goals: {
        for: 28,
        against: 12
      }
    },
    away: {
      played: 13,
      win: 9,
      draw: 4,
      lose: 0,
      goals: {
        for: 24,
        against: 15
      }
    }
  },
  {
    rank: 2,
    team: {
      id: 127,
      name: "Flamengo",
      logo: "https://media.api-sports.io/football/teams/127.png"
    },
    points: 61,
    goalsDiff: 18,
    group: "Serie A",
    form: "LWWWW",
    status: "same",
    description: "Promotion - Copa Libertadores (Group Stage)",
    all: {
      played: 27,
      win: 18,
      draw: 7,
      lose: 2,
      goals: {
        for: 48,
        against: 30
      }
    },
    home: {
      played: 14,
      win: 10,
      draw: 3,
      lose: 1,
      goals: {
        for: 26,
        against: 14
      }
    },
    away: {
      played: 13,
      win: 8,
      draw: 4,
      lose: 1,
      goals: {
        for: 22,
        against: 16
      }
    }
  },
  {
    rank: 3,
    team: {
      id: 128,
      name: "São Paulo",
      logo: "https://media.api-sports.io/football/teams/128.png"
    },
    points: 54,
    goalsDiff: 12,
    group: "Serie A",
    form: "DWWLW",
    status: "same",
    description: "Promotion - Copa Libertadores (Group Stage)",
    all: {
      played: 27,
      win: 15,
      draw: 9,
      lose: 3,
      goals: {
        for: 42,
        against: 30
      }
    },
    home: {
      played: 14,
      win: 9,
      draw: 4,
      lose: 1,
      goals: {
        for: 24,
        against: 13
      }
    },
    away: {
      played: 13,
      win: 6,
      draw: 5,
      lose: 2,
      goals: {
        for: 18,
        against: 17
      }
    }
  },
  {
    rank: 4,
    team: {
      id: 131,
      name: "Corinthians",
      logo: "https://media.api-sports.io/football/teams/131.png"
    },
    points: 50,
    goalsDiff: 8,
    group: "Serie A",
    form: "WDWLW",
    status: "same",
    description: "Promotion - Copa Libertadores (Group Stage)",
    all: {
      played: 27,
      win: 14,
      draw: 8,
      lose: 5,
      goals: {
        for: 38,
        against: 30
      }
    },
    home: {
      played: 14,
      win: 8,
      draw: 4,
      lose: 2,
      goals: {
        for: 21,
        against: 14
      }
    },
    away: {
      played: 13,
      win: 6,
      draw: 4,
      lose: 3,
      goals: {
        for: 17,
        against: 16
      }
    }
  },
  {
    rank: 5,
    team: {
      id: 153,
      name: "Atlético Mineiro",
      logo: "https://media.api-sports.io/football/teams/153.png"
    },
    points: 48,
    goalsDiff: 5,
    group: "Serie A",
    form: "DWLDW",
    status: "same",
    description: "Promotion - Copa Libertadores (Qualifying)",
    all: {
      played: 27,
      win: 13,
      draw: 9,
      lose: 5,
      goals: {
        for: 35,
        against: 30
      }
    },
    home: {
      played: 14,
      win: 8,
      draw: 4,
      lose: 2,
      goals: {
        for: 20,
        against: 13
      }
    },
    away: {
      played: 13,
      win: 5,
      draw: 5,
      lose: 3,
      goals: {
        for: 15,
        against: 17
      }
    }
  }
];

export const mockUser = {
  id: 1,
  name: "João Silva",
  email: "joao@email.com",
  provider: "credentials",
  createdAt: "2025-09-28T00:00:00Z"
};

export const mockFavorites = [
  {
    id: 1,
    userId: 1,
    teamId: 124,
    teamName: "Palmeiras",
    createdAt: "2025-09-28T00:00:00Z"
  },
  {
    id: 2,
    userId: 1,
    teamId: 127,
    teamName: "Flamengo",
    createdAt: "2025-09-28T00:00:00Z"
  }
];