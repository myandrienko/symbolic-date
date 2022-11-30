import { it, expect, beforeAll, vi, describe } from "vitest";
import { reviveSymbolicDate, SymbolicDate } from "./SymbolicDate";

beforeAll(() => {
  expect(
    new Date().toString(),
    "Tests are expected to run in UTC+04:00 timezone. " +
      "Set TZ environment variable, e.g. TZ=Asia/Baku. " +
      "Avoid timezones with DST"
  ).toContain("GMT+0400");
});

describe("core", () => {
  it("constructs current date", () => {
    vi.setSystemTime(new Date(Date.UTC(2022, 10, 30, 23, 0, 0, 0)));
    const date = new SymbolicDate();
    expect(date.toISOString()).toBe("2022-12-01");
  });

  it("constructs date from ISO string", () => {
    const date = new SymbolicDate("2022-12-01");
    expect(date.toISOString()).toBe("2022-12-01");
  });

  it("constructs invalid date from invalid ISO date string", () => {
    const date = new SymbolicDate("2022-12-01T12:00:00.000Z");
    expect(+date).toBe(Number.NaN);
  });

  it("constructs date from parts", () => {
    const date = new SymbolicDate(2022, 11, 1);
    expect(date.toISOString()).toBe("2022-12-01");
  });

  it("can reinterpret Date in local timezone", () => {
    const date = SymbolicDate.fromLocalDate(new Date(2022, 11, 1, 1, 0, 0, 0));
    expect(date.toISOString()).toBe("2022-12-01");
  });

  it("can reinterpret Date in UTC", () => {
    const date = SymbolicDate.fromUTCDate(
      new Date(Date.UTC(2022, 11, 1, 1, 0, 0, 0))
    );
    expect(date.toISOString()).toBe("2022-12-01");
  });

  it("allows date manipulation", () => {
    const date = new SymbolicDate("2022-12-01");
    date.setDate(date.getDate() - 1);
    date.setFullYear(1970);
    expect(date.toISOString()).toBe("1970-11-30");
  });

  it("converts to local midnight", () => {
    const date = new SymbolicDate("2022-12-01");
    expect(+date.asLocalMidnight()).toBe(+new Date(2022, 11, 1));
  });

  it("converts to UTC midnight", () => {
    const date = new SymbolicDate("2022-12-01");
    expect(+date.asUTCMidnight()).toBe(Date.UTC(2022, 11, 1));
  });
});

describe("JSON", () => {
  it("correctly serializes to JSON", () => {
    const date = new SymbolicDate("2022-12-01");
    expect(JSON.stringify({ date })).toBe('{"date":"2022-12-01"}');
  });

  it("can be used as JSON reviver", () => {
    const obj = JSON.parse(
      '{"date":"2022-12-01","notDate":"20221201"}',
      reviveSymbolicDate
    );
    expect(obj).toStrictEqual({
      date: new SymbolicDate("2022-12-01"),
      notDate: "20221201",
    });
  });
});
