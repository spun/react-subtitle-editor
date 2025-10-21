import "./segmentedButton.css";

interface SegmentedButtonOption<T> {
  id: T;
  key: string;
  text: string;
}

interface SegmentedButtonProps<T> {
  options: SegmentedButtonOption<T>[];
  selected: string;
  onSelected: (option: T) => void;
}

export function SegmentedButton<T>({ options, selected, onSelected: onOptionSelected }: SegmentedButtonProps<T>) {

  const handleOptionSelected = (option: T) => {
    onOptionSelected(option)
  }

  return (
    <ul className="segmentedButton">
      {
        options.map((option, index) => {
          const isSelected = option.id === selected;
          return (
            <li
              key={option.key}
              className={isSelected ? "selected" : ""}
              onClick={e => handleOptionSelected(option.id)}>
              {option.text}
            </li>
          )
        })
      }
    </ul>
  )
}
