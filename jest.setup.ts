import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock NextResponse for tests
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: ResponseInit) => {
      const body = JSON.stringify(data);
      return {
        status: init?.status || 200,
        ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
        headers: new Map(Object.entries(init?.headers || {})),
        json: async () => data,
        text: async () => body,
      };
    },
  },
}));

if (typeof Request === 'undefined') {
  global.Request = class MockRequest {
    constructor(input: RequestInfo, init?: RequestInit) {
      // Simple mock, can be expanded if needed
    }
  } as any;
}

if (typeof Response === 'undefined') {
  global.Response = class MockResponse {
    static json(data: any, init?: ResponseInit) {
      return new MockResponse(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
      });
    }

    constructor(public body: any, public init?: ResponseInit) {}

    json() {
      return Promise.resolve(typeof this.body === 'string' ? JSON.parse(this.body) : this.body);
    }

    get status() {
      return this.init?.status || 200;
    }

    get ok() {
      return this.status >= 200 && this.status < 300;
    }
  } as any;
}