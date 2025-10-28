import { TextButton } from "../buttons/buttons";
import './appBar.css'
import type { Theme } from "~/utils/useTheme";

interface AppBarProps {
  theme: Theme,
  setTheme: (theme: Theme) => void
  onClose: () => void;
}

export function AppBar({ theme, setTheme, onClose }: AppBarProps) {

  return (
    <nav className="appBar">
      <div className="themeSelect">
        <span className={theme == "system" ? 'selected' : ''} onClick={e => setTheme("system")}>System</span>
        <span className={theme == "light" ? 'selected' : ''} onClick={e => setTheme("light")}>Light</span>
        <span className={theme == "dark" ? 'selected' : ''} onClick={e => setTheme("dark")}>Dark</span>
      </div>
      <TextButton onClick={onClose}>Close</TextButton>
    </nav>
  )
}
