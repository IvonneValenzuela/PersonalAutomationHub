import { CO_HOLIDAYS } from '../helpers/holidays-colombia';

function getDeliveryDate(date: Date): string {

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${year}-${month}-${day}`;
}

function isSunday(date: Date): boolean {
  return date.getDay() === 0; // 0 = domingo
}

function isHoliday(date: Date): boolean {
  return CO_HOLIDAYS.includes(getDeliveryDate(date));
}

export function getNextValidDeliveryDate(): string {
  const date = new Date();

  while (isSunday(date) || isHoliday(date)) {
    date.setDate(date.getDate() + 1);
  }

  return getDeliveryDate(date);
}