export const USER_ROLES = ['admin', 'instructor', 'student'] as const;
export type UserRole = (typeof USER_ROLES)[number];
