export function repeatUntil(cb: (done: () => void) => unknown, interval = 5e3) {
  const intervalId = setInterval(cb, interval, () => clearInterval(intervalId))
}

export function randomBetween(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
