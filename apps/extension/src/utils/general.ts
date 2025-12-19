export function randomBetween(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function sleep(delay = 1000) {
  return new Promise((r) => setTimeout(r, delay))
}

