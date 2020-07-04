export class User {
  token: string;
  id: number;
  type: number;
  username: string;

  constructor(token: string, id: number, type: number, username: string) {
    this.token = token
    this.id = id
    this.type = type
    this.username = username
  }
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TokenData {
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  nbf: number;
  prv: string;
  sub: number;
  type: number;
  username: string;
}
