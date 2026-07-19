import type { JSX } from 'preact';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', class: className, ...rest }: ButtonProps) {
  const classes = ['button', `button--${variant}`, className].filter(Boolean).join(' ');
  return <button class={classes} {...rest} />;
}
