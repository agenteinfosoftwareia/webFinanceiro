export interface UserDto {
  id: string;
  name: string;
  email: string;
  isApproved: boolean;
  isAdmin: boolean;
  createdAt: string;
  lastLoginAt?: string;
}
