export function newId() {
  return `${Math.random().toString(36).substring(2, 15)}`;
}
