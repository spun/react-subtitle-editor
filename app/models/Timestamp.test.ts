import { describe, expect, test } from "vitest";
import { getMillisAsTimestamp, getTimestampInMillis, ZERO_TS, type Timestamp } from "./Timestamp";

describe("Timestamp", () => {
    test("ZERO_TS is all zeros", () => {
        expect(ZERO_TS).toEqual({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
    });

    test("timestamp to milliseconds", () => {
        const ts: Timestamp = { hours: 1, minutes: 2, seconds: 3, milliseconds: 456 };
        expect(getTimestampInMillis(ts)).toBe(3_723_456);
    })

    test('milliseconds to timestamp', () => {
        const ts: Timestamp = getMillisAsTimestamp(3_723_456);
        expect(ts).toEqual({ hours: 1, minutes: 2, seconds: 3, milliseconds: 456 });
    });
})
