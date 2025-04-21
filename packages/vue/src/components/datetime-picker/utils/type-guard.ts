export function isNumberArray(value: number | number[]): value is number[] {
  return Array.isArray(value)
}
