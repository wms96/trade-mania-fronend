export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface ILoginResult {
  token: string;
  refreshToken?: string;
  expiresAt?: Date;
  user?: IUser;

}
