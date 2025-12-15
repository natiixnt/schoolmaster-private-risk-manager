export const UserRole = {
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  DIRECTOR: 'DIRECTOR',
  TEACHER: 'TEACHER',
  COUNSELOR: 'COUNSELOR',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const StudentStatus = {
  ACTIVE: 'ACTIVE',
  GRADUATED: 'GRADUATED',
  LEFT: 'LEFT',
} as const;
export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUserInfo {
  id: string;
  schoolId: string;
  role: UserRole;
  email: string;
}

export interface HealthResponse {
  status: 'ok';
  db: 'ok' | 'error';
  details?: Record<string, unknown>;
}
