import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

(globalThis as any).import = { meta: { env: { VITE_WS_URL: 'ws://localhost:3000' } } };

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-v4'),
}));
