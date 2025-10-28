import { TextButton } from "../buttons/buttons";
import './appBar.css'
import type { Theme } from "~/utils/useTheme";

interface AppBarProps {
  theme: Theme,
  setTheme: (theme: Theme) => void,
  isFileOpen: Boolean,
  onClose: () => void;
}

export function AppBar({ theme, setTheme, isFileOpen, onClose }: AppBarProps) {

  return (
    <nav className="appBar">
      <div className="themeSelect">
        <span className={theme == "system" ? 'selected' : ''} onClick={e => setTheme("system")}>System</span>
        <span className={theme == "light" ? 'selected' : ''} onClick={e => setTheme("light")}>Light</span>
        <span className={theme == "dark" ? 'selected' : ''} onClick={e => setTheme("dark")}>Dark</span>
      </div>
      {isFileOpen &&
        <TextButton onClick={onClose}>Close</TextButton>
      }
    </nav>
  )
}
