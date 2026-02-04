type ChunkedSubmitArgs<T> = {
  items: T[];
  chunkSize: number;
  endpoint: string;
  checkpointKey: string;
  toPayload: (chunk: T[], chunkIndex: number) => unknown;
};

type ChunkedSubmitResult = {
  completedChunks: number;
  totalChunks: number;
};

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

async function postChunk(endpoint: string, payload: unknown) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Chunk submit failed");
  }
}

export async function submitInChunks<T>({
  items,
  chunkSize,
  endpoint,
  checkpointKey,
  toPayload,
}: ChunkedSubmitArgs<T>): Promise<ChunkedSubmitResult> {
  const totalChunks = Math.ceil(items.length / chunkSize);
  const startIndex = getStoredCheckpoint(checkpointKey);

  for (let chunkIndex = startIndex; chunkIndex < totalChunks; chunkIndex += 1) {
    const chunk = getChunk(items, chunkSize, chunkIndex);
    await postChunk(endpoint, toPayload(chunk, chunkIndex));
    saveCheckpoint(checkpointKey, chunkIndex + 1);
  }

  clearCheckpoint(checkpointKey);

  return { completedChunks: totalChunks, totalChunks };
}
