export interface IUser {
  id: string;
  name: string;
  email: string;
  otp_enabled: boolean;
}

export interface GenericResponse {
  status: string;
  message: string;
}

export interface ILoginResponse {
  status: string;
  user: IUser;
}

