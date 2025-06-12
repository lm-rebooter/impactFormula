export function formatNumber(val: any): string {
  if (val === null || val === undefined || val === '' || isNaN(val)) return '-';
  return Number(val).toLocaleString();
}
