import { useAuthStore } from '../store/user/store.ts';
import { useCartStore } from '../store/cart/useCartStore.ts';

let started = false;

export function initCartSync() {
  if (started) return;
  started = true;

  let prevUserId: number | null | undefined = undefined;

  const sync = async (state: ReturnType<typeof useAuthStore.getState>) => {
    const newUserId = state.user?.id ?? null;
    if (prevUserId === newUserId) return;

    if (!state.user) {
      const ws = useCartStore.getState().ws;
      try {
        ws?.close();
      } catch { /* empty */
      }
      useCartStore.setState({ ws: undefined, product: [] });
      prevUserId = newUserId;
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (useCartStore as any).persist?.rehydrate?.();
    useCartStore.getState().connectWebSocket();

    prevUserId = newUserId;
  };

  void sync(useAuthStore.getState());

  useAuthStore.subscribe((state) => {
    void sync(state);
  });
}
