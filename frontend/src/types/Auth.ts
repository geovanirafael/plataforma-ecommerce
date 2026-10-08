export interface User {
  id: number
  name: string
  email: string
  role: 'customer' | 'admin'
}

export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: User
}