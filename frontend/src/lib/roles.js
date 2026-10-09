/**
 * Role definitions and authorization helpers
 * Roles: super_admin > admin > customer
 */

export const ROLES = Object.freeze({
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
});

export const ROLE_HIERARCHY = Object.freeze({
  [ROLES.CUSTOMER]: 1,
  [ROLES.ADMIN]: 2,
  [ROLES.SUPER_ADMIN]: 3,
});

/**
 * Extracts normalized role string from user object or string argument.
 * Returns null if invalid or missing.
 */
export function getRole(userOrRole) {
  if (!userOrRole) return null;
  if (typeof userOrRole === 'string') return userOrRole;
  if (typeof userOrRole === 'object' && typeof userOrRole.role === 'string') {
    return userOrRole.role;
  }
  return null;
}

/**
 * Check if user meets minimum required role rank in the hierarchy.
 */
export function hasMinimumRole(userOrRole, minimumRole) {
  const role = getRole(userOrRole);
  if (!role || !minimumRole) return false;
  const userRank = ROLE_HIERARCHY[role] ?? 0;
  const minRank = ROLE_HIERARCHY[minimumRole] ?? 999;
  return userRank >= minRank;
}

/**
 * Check if user has any of the specified roles.
 * Returns false if user or role is missing or roles list is empty.
 */
export function hasRole(userOrRole, allowedRoles = []) {
  const role = getRole(userOrRole);
  if (!role || !Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return false;
  }
  return allowedRoles.includes(role);
}

/**
 * Check if role is staff (admin or super_admin).
 */
export function isStaff(userOrRole) {
  const role = getRole(userOrRole);
  if (!role) return false;
  return [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

/**
 * Check if role is admin or higher (admin or super_admin).
 */
export function isAdminOrAbove(userOrRole) {
  const role = getRole(userOrRole);
  if (!role) return false;
  return [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

/**
 * Check if role is super_admin.
 */
export function isSuperAdmin(userOrRole) {
  const role = getRole(userOrRole);
  return role === ROLES.SUPER_ADMIN;
}

/**
 * Check if role is customer.
 */
export function isCustomer(userOrRole) {
  const role = getRole(userOrRole);
  return role === ROLES.CUSTOMER;
}
