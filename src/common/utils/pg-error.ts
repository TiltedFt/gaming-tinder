import { PgIntegrityConstraintViolation } from '../constants/postgres.errors';

export function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Object &&
    'code' in error &&
    error.code === PgIntegrityConstraintViolation.UniqueViolation
  );
}

export function getViolationDetail(error: unknown): string {
  if (error instanceof Object && 'detail' in error) {
    return String(error.detail);
  }
  return '';
}
