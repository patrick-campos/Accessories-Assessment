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

export async function submitInChunks<T>({
  items,
  chunkSize,
  endpoint,
  checkpointKey,
  toPayload,
}: ChunkedSubmitArgs<T>): Promise<ChunkedSubmitResult> {
  const totalChunks = Math.ceil(items.length / chunkSize);
  const storedIndex =
    typeof window !== "undefined"
      ? Number(window.localStorage.getItem(checkpointKey) ?? "0")
      : 0;
  const startIndex = Number.isFinite(storedIndex) ? storedIndex : 0;

  for (let chunkIndex = startIndex; chunkIndex < totalChunks; chunkIndex += 1) {
    const chunkStart = chunkIndex * chunkSize;
    const chunk = items.slice(chunkStart, chunkStart + chunkSize);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(chunk, chunkIndex)),
    });

    if (!response.ok) {
      throw new Error("Chunk submit failed");
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(checkpointKey, String(chunkIndex + 1));
    }
  }

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(checkpointKey);
  }

  return { completedChunks: totalChunks, totalChunks };
}
