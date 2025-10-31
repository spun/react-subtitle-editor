import { useRef, useEffect, useCallback } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  ariaLabel?: string;
}

export function NumberInput({ value, onChange, min: minValue, max: maxValue, ariaLabel }: NumberInputProps) {

  const inputRef = useRef<HTMLInputElement>(null)
  // Store `value` in a ref so our event listener effect can access the latest number without
  // adding `value` as a dependency, which would recreate the listener each time `value` changes.
  const valueRef = useRef(value)

  // Keep ref updated with latest value
  useEffect(() => {
    valueRef.current = value
  }, [value])

  // Clamp number between min and max
  const applyLimits = useCallback((number: number): number => (
    Math.min(Math.max(number, minValue), maxValue)
  ), [maxValue, minValue])

  // increment/decrement the value when the user scrolls over the input
  const handleWheelEvent = useCallback((e: WheelEvent) => {
    const input = inputRef.current;
    if (!input) return;

    // auto-focus if not already focused
    if (document.activeElement !== input) {
      input.focus();
    }

    // update value
    const currentValue = valueRef.current
    if (!isNaN(currentValue)) {
      const newValue = e.deltaY < 0 ? currentValue + 1 : currentValue - 1
      onChange(applyLimits(newValue))
    }
    e.preventDefault()
  }, [onChange, applyLimits])


  // Attach the wheel event listener to the input element
  // Using native listener because "React uses passive event handlers by 
  // default with wheel" and "can't call stopPropagation within them".
  // https://stackoverflow.com/q/63663025
  useEffect(() => {
    const el = inputRef.current
    if (!el) {
      console.error("inputRef is not set")
      return
    }

    el.addEventListener("wheel", handleWheelEvent, { passive: false })
    return () => {
      el.removeEventListener("wheel", handleWheelEvent)
    }
  }, [handleWheelEvent])


  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetNumber = Number(e.target.value)
    if (!isNaN(targetNumber)) {
      onChange(applyLimits(targetNumber))
    }
  }

  return (
    <input ref={inputRef} type="number" min={minValue} max={maxValue} value={value} onChange={handleChange} aria-label={ariaLabel} />
  )
}
