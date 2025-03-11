export function formatCompactNumber(number: number): string {
    if (number < 1000) {
      return typeof number === 'number' ? number.toFixed(3) : number;
    } else if (number < 1000000) {
      return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else if (number < 1000000000) {
      return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else {
      return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
  }