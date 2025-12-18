import { useAuthStore } from '../user/store';

export function getCartStorageScope(): string {
  const user = useAuthStore.getState().user;
  return user ? `user:${user.id}` : 'guest';
}

export function getUserCartChannel(): string | null {
  const user = useAuthStore.getState().user;
  return user ? `user:${user.id}` : null;
}
