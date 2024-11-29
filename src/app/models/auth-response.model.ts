export interface Profile {
  name: string,
  email: string,
  phone: string
}

export interface AuthResponse {
  token: string;
  profile: Profile;
  role: string;
}
