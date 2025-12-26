export const mockAuthService = {
  validateLocal: vi.fn(),
  validateJwt: vi.fn(),
  validateRefreshJwt: vi.fn(),
  register: vi.fn(),
  login: vi.fn(),
  refresh: vi.fn(),
  userInfo: vi.fn(),
};
