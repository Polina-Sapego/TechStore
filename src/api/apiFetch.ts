import Cookies from 'js-cookie';
import { toast } from 'sonner';

export type ApiResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  message?: string;
};

type ApiOptions = RequestInit & {
  showToast?: boolean;
};

type ApiError = {
  message?: string;
};

const API_BASE = 'http://localhost:3000';

export async function apiFetch<T = unknown>(
  url: string,
  options: ApiOptions = {}
): Promise<ApiResult<T>> {
  try {
    const token = Cookies.get('token');

    const headers: HeadersInit = {
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE}${url}`, {
      credentials: 'include',
      ...options,
      headers,
    });

    let data: T | null;

    try {
      data = (await res.json()) as T;
    } catch {
      data = null;
    }

    if (!res.ok) {
      const errorData = data as ApiError | null;

      const msg =
        errorData?.message ?? `Server error (${res.status})`;

      console.error(
        `%c[API ERROR] ${url}`,
        'color:#ff4444;font-weight:bold;',
        msg,
      );

      if (options.showToast) toast.error(msg);

      if (res.status === 401) {
        Cookies.remove('token');
      }

      return {
        ok: false,
        status: res.status,
        data: null,
        message: msg,
      };
    }

    if (options.showToast) toast.success('Success');

    return {
      ok: true,
      status: res.status,
      data,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error';

    console.error(
      `%c[API CRASH] ${url}`,
      'color:orange;font-weight:bold;',
      msg,
    );

    if (options.showToast) toast.error(msg);

    return {
      ok: false,
      status: 0,
      data: null,
      message: msg,
    };
  }
}
