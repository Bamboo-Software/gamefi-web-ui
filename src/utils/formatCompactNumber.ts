export function formatCompactNumber(number: number): string {
  if (number < 1000) {
    return Math.floor(number).toLocaleString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
  } else if (number < 1000000000) {
    return (number / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
  } else {
    return (number / 1000000000).toFixed(2).replace(/\.0$/, '') + 'B';
  }
}

export function formatCompactUser(number: number): string {
  if (number < 1000) {
    return number.toLocaleString();
  } else if (number < 1000000) {
    return (number / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
  } else if (number < 1000000000) {
    return (number / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
  } else {
    return (number / 1000000000).toFixed(2).replace(/\.0$/, '') + 'B';
  }
}