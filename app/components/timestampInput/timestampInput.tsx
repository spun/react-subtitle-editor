import type { Timestamp } from '~/models/Timestamp';
import { NumberInput } from '../numberInput/numberInput';
import "./timestampInput.css";


interface TimestampInputProps {
  timestamp: Timestamp,
  onTimestampChange: (timestamp: Timestamp) => void;
}

export function TimestampInput({ timestamp, onTimestampChange }: TimestampInputProps) {

  const hours = timestamp.hours
  const minutes = timestamp.minutes
  const seconds = timestamp.seconds
  const millis = timestamp.milliseconds

  const setHours = (hours: number) => {
    onTimestampChange({
      ...timestamp,
      hours: hours
    })
  }

  const setMinutes = (minutes: number) => {
    onTimestampChange({
      ...timestamp,
      minutes: minutes
    })
  }

  const setSeconds = (seconds: number) => {
    onTimestampChange({
      ...timestamp,
      seconds: seconds
    })
  }

  const setMillis = (millis: number) => {
    onTimestampChange({
      ...timestamp,
      milliseconds: millis
    })
  }

  return (
    <div className="timestampInput">
      <p>
        Minutes:
        <br />
        <input type="range" value={minutes} min="0" max="59" onChange={e => { setMinutes(Number(e.target.value)) }} aria-label="Minutes" />
      </p>
      <p>
        Seconds:
        <br />
        <input type="range" value={seconds} min="0" max="59" onChange={e => { setSeconds(Number(e.target.value)) }} aria-label="Seconds" />
      </p>
      <p>
        Milliseconds:
        <br />
        <input type="range" value={millis} min="0" max="999" onChange={e => { setMillis(Number(e.target.value)) }} aria-label="Milliseconds" />
      </p>
      <NumberInput value={hours} min={0} max={99} onChange={setHours} ariaLabel="Hours" />:
      <NumberInput value={minutes} min={0} max={59} onChange={setMinutes} ariaLabel="Minutes" />:
      <NumberInput value={seconds} min={0} max={59} onChange={setSeconds} ariaLabel="Seconds" />,
      <NumberInput value={millis} min={0} max={999} onChange={setMillis} ariaLabel="Milliseconds" />
    </div>
  )
}
