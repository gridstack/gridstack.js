export function newId() {
  return `widget-${Math.random().toString(36).substring(2, 15)}`;
}
