type ChunkedSubmitArgs<T> = {
  items: T[];
  chunkSize: number;
  endpoint: string;
  checkpointKey: string;
  toPayload: (chunk: T[], chunkIndex: number) => unknown;
  postAdapter: PostAdapter;
};

type ChunkedSubmitResult = {
  completedChunks: number;
  totalChunks: number;
};

type RestPostClient = {
  post: (path: string, payload?: unknown) => Promise<unknown>;
};

export type PostAdapter = {
  post: (endpoint: string, payload: unknown) => Promise<void>;
};

export function createRestClientPostAdapter(client: RestPostClient): PostAdapter {
  return {
    async post(endpoint: string, payload: unknown) {
      const url = new URL(endpoint);
      await client.post(url.pathname + url.search, payload);
    },
  };
}

function getStoredCheckpoint(checkpointKey: string) {
  if (typeof window === "undefined") return 0;
  const storedIndex = Number(window.localStorage.getItem(checkpointKey) ?? "0");
  return Number.isFinite(storedIndex) ? storedIndex : 0;
}

function saveCheckpoint(checkpointKey: string, nextIndex: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(checkpointKey, String(nextIndex));
}

function clearCheckpoint(checkpointKey: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(checkpointKey);
}

function getChunk<T>(items: T[], chunkSize: number, chunkIndex: number) {
  const start = chunkIndex * chunkSize;
  return items.slice(start, start + chunkSize);
}

async function postChunk(endpoint: string, payload: unknown, adapter: PostAdapter) {
  await adapter.post(endpoint, payload);
}

export async function submitInChunks<T>({
  items,
  chunkSize,
  endpoint,
  checkpointKey,
  toPayload,
  postAdapter,
}: ChunkedSubmitArgs<T>): Promise<ChunkedSubmitResult> {
  const totalChunks = Math.ceil(items.length / chunkSize);
  const startIndex = getStoredCheckpoint(checkpointKey);

  for (let chunkIndex = startIndex; chunkIndex < totalChunks; chunkIndex += 1) {
    const chunk = getChunk(items, chunkSize, chunkIndex);
    await postChunk(endpoint, toPayload(chunk, chunkIndex), postAdapter);
    saveCheckpoint(checkpointKey, chunkIndex + 1);
  }

  clearCheckpoint(checkpointKey);

  return { completedChunks: totalChunks, totalChunks };
}
