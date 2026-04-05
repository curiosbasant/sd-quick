export function randomBetween(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function sleep(delay = 1000) {
  return new Promise((r) => setTimeout(r, delay))
}

export async function processInParallel<TPayload, TResult>(
  payloads: TPayload[],
  callback: (payload: TPayload) => Promise<TResult>,
  { concurrency = 5, retries = 3, delay = 250 } = {},
) {
  const results: (
    | { success: true; data: TResult }
    | { success: false; payload: TPayload; error: unknown }
  )[] = []

  const withRetry = async (payload: TPayload, index: number, attempt = 0) => {
    try {
      const data = await callback(payload)
      results[index] = { success: true, data }
    } catch (error) {
      if (attempt < retries) {
        await sleep(delay)
        return withRetry(payload, index, attempt + 1)
      }
      results[index] = { success: false, payload, error }
    }
  }

  let currentIndex = 0
  const workers = Array.from({ length: Math.min(concurrency, payloads.length) }, async () => {
    while (currentIndex < payloads.length) {
      const index = currentIndex++
      await withRetry(payloads[index], index)
    }
  })

  await Promise.all(workers)
  return results
}
