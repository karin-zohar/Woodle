type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const DEFAULT_TIMEOUT_MS = 10_000;

export async function apiRequest<TResponse = unknown>(
  baseUrl: string,
  method: HttpMethod,
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<TResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const options: RequestInit = {
    method,
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, options);

    if (!response.ok) {
      const text = await response.text();
      const error = new Error(text);
      (error as Error & { status: number }).status = response.status;
      throw error;
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      const timeoutError = new Error(`Request timed out after ${timeoutMs}ms: ${method} ${baseUrl}${path}`);
      (timeoutError as Error & { status: number }).status = 408;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
