import { createRestClientPostAdapter, submitInChunks } from "./chunkedSubmit";

describe("chunkedSubmit", () => {
  test("submitInChunks posts each chunk and clears checkpoint", async () => {
    const postAdapter = { post: jest.fn().mockResolvedValue(undefined) };
    const items = [1, 2, 3, 4, 5];
    const checkpointKey = "test-checkpoint";

    window.localStorage.setItem(checkpointKey, "0");

    await submitInChunks({
      items,
      chunkSize: 2,
      endpoint: "https://api.example.com/submit",
      checkpointKey,
      toPayload: (chunk, chunkIndex) => ({ chunk, chunkIndex }),
      postAdapter,
    });

    expect(postAdapter.post).toHaveBeenCalledTimes(3);
    expect(window.localStorage.getItem(checkpointKey)).toBeNull();
  });

  test("createRestClientPostAdapter maps endpoint to rest client path", async () => {
    const client = { post: jest.fn().mockResolvedValue(undefined) };
    const adapter = createRestClientPostAdapter(client);

    await adapter.post("https://api.example.com/v1/submit?x=1", { ok: true });

    expect(client.post).toHaveBeenCalledWith("/v1/submit?x=1", { ok: true });
  });
});
