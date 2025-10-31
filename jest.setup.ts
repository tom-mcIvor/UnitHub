import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

if (typeof Request === 'undefined') {
  global.Request = class MockRequest {
    constructor(input: RequestInfo, init?: RequestInit) {
      // Simple mock, can be expanded if needed
    }
  } as any;
}