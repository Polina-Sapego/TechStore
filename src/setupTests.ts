import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';
import fetchMock from 'jest-fetch-mock';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

afterEach(() => {
  cleanup();
});

fetchMock.enableMocks();

(globalThis as any).import = { meta: { env: { VITE_WS_URL: 'ws://localhost:3000' } } };

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid-v4'),
}));
