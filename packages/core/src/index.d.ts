export declare const UserRole: {
    readonly SCHOOL_ADMIN: "SCHOOL_ADMIN";
    readonly DIRECTOR: "DIRECTOR";
    readonly TEACHER: "TEACHER";
    readonly COUNSELOR: "COUNSELOR";
    readonly SUPERADMIN: "SUPERADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const StudentStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly GRADUATED: "GRADUATED";
    readonly LEFT: "LEFT";
};
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
    uptimeSeconds?: number;
    version?: string;
    timestamp?: string;
    details?: Record<string, unknown>;
}
