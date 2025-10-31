import { TextButton } from "../buttons/buttons";
import type { Theme } from "~/utils/useTheme";
import './topBar.css'

interface TopBarProps {
  theme: Theme,
  setTheme: (theme: Theme) => void,
  isFileOpen: boolean,
  onClose: () => void;
}

export function TopBar({ theme, setTheme, isFileOpen, onClose }: TopBarProps) {

  return (
    <nav className="topBar">
      <div className="themeSelect">
        <span className={theme === "system" ? 'selected' : ''} onClick={() => { setTheme("system") }}>System</span>
        <span className={theme === "light" ? 'selected' : ''} onClick={() => { setTheme("light") }}>Light</span>
        <span className={theme === "dark" ? 'selected' : ''} onClick={() => { setTheme("dark") }}>Dark</span>
      </div>
      {isFileOpen &&
        <TextButton onClick={onClose}>Close</TextButton>
      }
    </nav >
  )
}
