type RequestOptions = {
  token?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export class RestClient {
  constructor(private readonly baseUrl: string) {}

  async get<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("POST", path, body, options);
  }

  async put<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("PUT", path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("PATCH", path, body, options);
  }

  async delete<T>(path: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: options.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  }
}
