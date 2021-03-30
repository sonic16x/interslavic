export function isApril1() {
  const seed = typeof localStorage !== 'undefined'
    ? localStorage.getItem('APRIL_1_TEST')
    : null;

  const now = new Date(seed || undefined);
  return now.getMonth() === 3 && now.getDate() === 1 && now.getFullYear() === 2021;
}
