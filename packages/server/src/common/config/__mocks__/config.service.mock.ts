import { EnvSchemaType } from '../env';

export const createMockConfigService = (
  properties: Partial<EnvSchemaType> = {},
) => ({
  get: vi.fn((key: string): string | undefined => properties[key]),
});
