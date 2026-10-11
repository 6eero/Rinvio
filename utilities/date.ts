import { differenceInCalendarDays, format, isValid, parse } from "date-fns";

// Climb dates are calendar days stored as "yyyy-MM-dd" in the device's local
// time. Never go through toISOString(): it converts to UTC and shifts the day
// around midnight (e.g. 00:30 in Italy is still yesterday in UTC).

const ISO_DATE = "yyyy-MM-dd";

/** Local calendar day of `date` as "yyyy-MM-dd". */
export const toISODate = (date: Date): string => format(date, ISO_DATE);

/** "yyyy-MM-dd" → Date at local midnight of that day. */
export const fromISODate = (value: string): Date =>
  parse(value, ISO_DATE, new Date());

export const todayISO = (): string => toISODate(new Date());

export const isISODate = (value: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && isValid(fromISODate(value));

export const formatLongDate = (value: string, locale: string): string =>
  fromISODate(value).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

/** Calendar days from `value` to `today`: 0 is today, 1 yesterday. */
export const daysAgo = (value: string, today: Date = new Date()): number =>
  differenceInCalendarDays(today, fromISODate(value));

/** "Sab 10 ott", with the year only when it isn't `today`'s. */
export const formatShortDate = (
  value: string,
  locale: string,
  today: Date = new Date(),
): string => {
  const date = fromISODate(value);
  return capitalize(
    date.toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
    }),
  );
};

/** "yyyy-MM" → "Ottobre 2026". */
export const formatMonth = (value: string, locale: string): string =>
  capitalize(
    parse(value, "yyyy-MM", new Date()).toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    }),
  );
