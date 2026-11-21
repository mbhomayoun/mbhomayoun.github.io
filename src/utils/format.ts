import { Lang } from '../data/profile';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

export function formatNum(input: string | number, lang: Lang): string {
  return lang === 'fa' ? toPersianDigits(input) : String(input);
}

export function formatDateForLang(dateStr: string, lang: Lang): string {
  if (!dateStr) return '';
  if (lang === 'fa') {
    return toPersianDigits(dateStr.replace(/-/g, '/'));
  }
  return dateStr;
}
