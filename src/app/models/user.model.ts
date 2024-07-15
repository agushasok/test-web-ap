export interface User {
  login: string;
  portfolios: string[];
  clientId: string;
}

export interface RefreshTokenResponse {
  jwt: string;
}

export interface JwtBody {
  exp: number;
  portfolios: string;
  clientid: string;
  ein: string;
  agreements: string;
  sub: string;
}
