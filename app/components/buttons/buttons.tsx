import type { IconType } from '../icons/icons';
import './buttons.css'

interface BaseButtonProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}

interface ButtonProps extends BaseButtonProps {
  leadingIcon?: IconType;
}

function BaseButton({ className, children, onClick, leadingIcon: LeadingIcon }: ButtonProps) {
  return (
    <button
      className={`button ${LeadingIcon ? `withIcon ` : ''} ${className ?? ''}`}
      onClick={onClick}
    >
      {LeadingIcon && <LeadingIcon />}{children}
    </button>
  )
}

export function FilledButton({ className, children, onClick, leadingIcon }: ButtonProps) {
  return (
    <BaseButton
      className={`filledButton ${className ?? ''}`}
      leadingIcon={leadingIcon}
      onClick={onClick}
    >
      {children}
    </BaseButton >
  )
}

export function TextButton({ className, children, onClick, leadingIcon }: ButtonProps) {
  return (
    <BaseButton
      className={`textButton ${className ?? ''}`}
      leadingIcon={leadingIcon}
      onClick={onClick}
    >
      {children}
    </BaseButton >
  )
}

export function OutlinedButton({ className, children, onClick, leadingIcon }: ButtonProps) {
  return (
    <BaseButton
      className={`outlinedButton ${className ?? ''}`}
      leadingIcon={leadingIcon}
      onClick={onClick}
    >
      {children}
    </BaseButton >
  )
}

export function IconButton({ className, children, onClick, ariaLabel }: BaseButtonProps) {

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick()
      e.stopPropagation()
    }
  }

  return (
    <button
      className={`iconButton filledButton ${className ?? ''}`}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </button >
  )
}