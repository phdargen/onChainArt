/**
 * Retry configuration options
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Maximum delay in milliseconds (default: 30000) */
  maxDelay?: number;
  /** Backoff multiplier (default: 2) */
  backoffMultiplier?: number;
  /** Function to determine if an error should trigger a retry (default: retry all errors) */
  shouldRetry?: (error: unknown) => boolean;
  /** Callback function called on each retry attempt */
  onRetry?: (error: unknown, attempt: number, nextDelay: number) => void;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_OPTIONS: Required<Omit<RetryOptions, "shouldRetry" | "onRetry">> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
};

/**
 * Wraps an async function with retry logic using exponential backoff
 *
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns Promise that resolves with the function result or rejects after all retries
 *
 * @example
 * ```typescript
 * const result = await withRetry(
 *   async () => await someTransaction(),
 *   {
 *     maxRetries: 5,
 *     initialDelay: 2000,
 *     onRetry: (error, attempt, delay) => {
 *       console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
 *     }
 *   }
 * );
 * ```
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { maxRetries, initialDelay, maxDelay, backoffMultiplier } = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  };

  const shouldRetry = options.shouldRetry ?? (() => true);
  const onRetry = options.onRetry ?? (() => {});

  let lastError: unknown;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if we've exhausted all attempts
      if (attempt === maxRetries) {
        break;
      }

      // Check if we should retry this error
      if (!shouldRetry(error)) {
        throw error;
      }

      // Calculate next delay with exponential backoff
      const nextDelay = Math.min(delay, maxDelay);

      // Call the retry callback
      onRetry(error, attempt + 1, nextDelay);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, nextDelay));

      // Increase delay for next attempt
      delay *= backoffMultiplier;
    }
  }

  // All retries exhausted, throw the last error
  throw lastError;
}

/**
 * Helper function specifically for transaction operations
 * Includes sensible defaults for blockchain transactions
 */
export async function withTransactionRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  return withRetry(fn, {
    maxRetries: 5,
    initialDelay: 2000,
    maxDelay: 60000,
    backoffMultiplier: 2,
    onRetry: (error, attempt, delay) => {
      console.log(`Transaction attempt ${attempt} failed, retrying in ${delay}ms...`);
      console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
    },
    ...options,
  });
}

/**
 * Helper function specifically for user operations
 * Includes sensible defaults for user operations
 */
export async function withUserOperationRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  return withRetry(fn, {
    maxRetries: 5,
    initialDelay: 2000,
    maxDelay: 60000,
    backoffMultiplier: 2,
    onRetry: (error, attempt, delay) => {
      console.log(`User operation attempt ${attempt} failed, retrying in ${delay}ms...`);
      console.log(`Error: ${error instanceof Error ? error.message : String(error)}`);
    },
    ...options,
  });
}
