export interface IAuth {
  email: string;
  password: string;
  clientInfo?: {
    device: string;
    browser: string;
    ipAddress: string;
    pcName?: string;
    os?: string;
    userAgent?: string;
  };
}

export interface IJwtPayload {
  user_id: string;
  name: string;
  email: string;
  is_active: boolean;
  last_login?: Date;
  profile_photo?: string;
  role: string;
}

export interface IOTPVerificationPayload {
  user_id: string;
  email: string;
  type: string;
}

