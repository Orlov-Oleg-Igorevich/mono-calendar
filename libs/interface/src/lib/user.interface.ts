export interface IUser {
  id: string;
  email: string;
  isEmailVerified: boolean;
  passwordHash: string;

  name: string;
  avatarUrl: string | null;
}
