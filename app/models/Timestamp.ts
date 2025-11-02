export interface Timestamp {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export const ZERO_TS: Timestamp = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
};

export function getMillisAsTimestamp(ms: number): Timestamp {
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1_000);
  const milliseconds = ms % 1_000;
  return { hours, minutes, seconds, milliseconds };
}

export function getTimestampInMillis(timestamp: Timestamp): number {
  const totalMillis =
    (timestamp.hours * 60 * 60 * 1000) +
    (timestamp.minutes * 60 * 1000) +
    (timestamp.seconds * 1000) +
    timestamp.milliseconds;
  return totalMillis
}
