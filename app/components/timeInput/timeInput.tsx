import { useState } from 'react';
import { NumberInput } from '../numberInput/numberInput';
import "./timeInput.css";

interface TimeInputProps {
  onSyncRequest: (millis: number) => void;
}

export function TimeInput({ onSyncRequest }: TimeInputProps) {

  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  const [millis, setMillis] = useState<number>(0)

  const getTimeInSeconds = (): number => {
    const totalMillis =
      (hours * 60 * 60 * 1000) +
      (minutes * 60 * 1000) +
      (seconds * 1000) +
      millis;
    return totalMillis
  }

  const handleAddTime = () => {
    const timeInMillis = getTimeInSeconds()
    onSyncRequest(timeInMillis)
  }

  const handleRemoveTime = () => {
    const timeInMillis = getTimeInSeconds()
    onSyncRequest(-timeInMillis)
  }

  return (
    <section className="timeInput">
      <p>
        Minutes:
        <br />
        <input type="range" value={minutes} min="0" max="59" onChange={e => setMinutes(Number(e.target.value))} />
      </p>
      <p>
        Seconds:
        <br />
        <input type="range" value={seconds} min="0" max="59" onChange={e => setSeconds(Number(e.target.value))} />
      </p>
      <p>
        Milliseconds:
        <br />
        <input type="range" value={millis} min="0" max="999" onChange={e => setMillis(Number(e.target.value))} />
      </p>
      <NumberInput value={hours} min={0} max={99} onChange={setHours} />:
      <NumberInput value={minutes} min={0} max={59} onChange={setMinutes} />:
      <NumberInput value={seconds} min={0} max={59} onChange={setSeconds} />,
      <NumberInput value={millis} min={0} max={999} onChange={setMillis} />
      <div className="actions">
        <button className="button textButton" onClick={handleAddTime}>Add time</button>
        <button className="button textButton" onClick={handleRemoveTime}>Remove time</button>
      </div>
    </section>
  )
}
