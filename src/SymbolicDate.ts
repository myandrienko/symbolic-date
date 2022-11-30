const isoDateRegex = /^\d{4}-[01]\d-[0-3]\d$/;
const isoDateLength = 10;

export class SymbolicDate {
  // UTC midnight at the current date
  private date: Date;

  constructor();
  constructor(dateString: string);
  constructor(year: number, monthIndex: number, day: number);
  constructor(
    maybeYearOrDateString?: string | number,
    maybeMonthIndex?: number,
    maybeDay?: number
  ) {
    if (
      typeof maybeYearOrDateString === "undefined" &&
      typeof maybeMonthIndex === "undefined" &&
      typeof maybeDay === "undefined"
    ) {
      const today = new Date();
      this.date = new Date(
        Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
      );
      return this;
    }

    if (
      typeof maybeYearOrDateString === "string" &&
      isoDateRegex.test(maybeYearOrDateString)
    ) {
      // Constructing a date from ISO date string produces UTC midnight
      // timestamp which is exactly what we need
      this.date = new Date(maybeYearOrDateString);
      return this;
    }

    if (
      typeof maybeYearOrDateString === "number" &&
      typeof maybeMonthIndex === "number" &&
      typeof maybeDay === "number"
    ) {
      this.date = new Date(
        Date.UTC(maybeYearOrDateString, maybeMonthIndex, maybeDay)
      );
      return this;
    }

    this.date = new Date(Number.NaN);
  }

  static fromLocalDate(date: Date): SymbolicDate {
    return new SymbolicDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  static fromUTCDate(date: Date): SymbolicDate {
    return new SymbolicDate(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
  }

  getDate(): number {
    return this.date.getUTCDate();
  }

  getMonth(): number {
    return this.date.getUTCMonth();
  }

  getFullYear(): number {
    return this.date.getUTCFullYear();
  }

  getDay(): number {
    return this.date.getUTCDay();
  }

  setDate(date: number): SymbolicDate {
    this.date.setUTCDate(date);
    return this;
  }

  setMonth(monthIndex: number, date?: number): SymbolicDate {
    this.date.setUTCMonth(monthIndex, date ?? this.date.getUTCDate());
    return this;
  }

  setFullYear(year: number, monthIndex?: number, date?: number): SymbolicDate {
    this.date.setUTCFullYear(
      year,
      monthIndex ?? this.date.getUTCMonth(),
      date ?? this.date.getUTCDate()
    );
    return this;
  }

  toString(): string {
    return this.date.toDateString();
  }

  toLocaleString(): string;
  toLocaleString(locales: string | string[]): string;
  toLocaleString(
    locales: string | string[],
    options: Intl.DateTimeFormatOptions
  ): string;
  toLocaleString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string {
    return this.date.toLocaleDateString(locales, options);
  }

  toUTCString(): string {
    return this.date.toISOString().substring(0, isoDateLength);
  }

  [Symbol.toPrimitive](): number {
    return +this.date;
  }

  valueOf(): number {
    return +this.date;
  }

  toJSON(): string {
    return this.toUTCString();
  }
}

export function reviveSymbolicDate(key: string, value: unknown): unknown {
  if (typeof value === "string") {
    const maybeValidDate = new SymbolicDate(value);
    if (!Number.isNaN(+maybeValidDate)) {
      return maybeValidDate;
    }
  }

  return value;
}
