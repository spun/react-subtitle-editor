import { useState } from "react";
import { TextButton } from "../buttons/buttons";
import { TimestampInput } from "../timestampInput/timestampInput"
import { getTimestampInMillis, ZERO_TS } from "~/models/Timestamp";

interface SyncSettingsProps {
  onSyncRequest: (millis: number) => void;
}

export function SyncSettings({ onSyncRequest }: SyncSettingsProps) {

  const [timestamp, setTimestamp] = useState(ZERO_TS)

  const handleAddTime = () => {
    onSyncRequest(getTimestampInMillis(timestamp))
  }

  const handleRemoveTime = () => {
    onSyncRequest(-getTimestampInMillis(timestamp))
  }

  return (
    <section className="card">
      <h3>Sync correction</h3>
      <TimestampInput timestamp={timestamp} onTimestampChange={setTimestamp} />
      <div className="actions">
        <TextButton onClick={handleAddTime}>Add time</TextButton>
        <TextButton onClick={handleRemoveTime}>Remove time</TextButton>
      </div>
    </section>
  )
}