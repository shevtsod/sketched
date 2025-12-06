/**
 * Error for incorrect or invalid pagination arguments
 */
export class PaginationArgsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
