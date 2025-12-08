import { BadRequestException } from '@nestjs/common';

/**
 * Error for incorrect or invalid pagination arguments
 */
export class PaginationArgsError extends BadRequestException {
  constructor(message?: string) {
    super(message ?? 'Invalid pagination arguments');
  }
}
