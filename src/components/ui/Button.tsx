import type { ComponentChildren } from 'preact';
import './Button.css';
import { useRouter } from '../../app/router';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive';

interface ButtonProps {
  variant?: ButtonVariant;
  children: ComponentChildren;
  className?: string;
  href?: string;
  onClick?: (event: MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
}

function isExternal(href: string): boolean {
  return /^([a-z]+:)?\/\//i.test(href);
}

export function Button({
  variant = 'primary',
  children,
  className,
  href,
  onClick,
  type = 'button',
  disabled,
  ...rest
}: ButtonProps) {
  const classes = ['button', `button--${variant}`, className].filter(Boolean).join(' ');
  const { navigate } = useRouter();

  if (href !== undefined) {
    if (isExternal(href)) {
      return (
        <a className={classes} href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    }

    return (
      <a
        className={classes}
        href={href}
        {...rest}
        onClick={(event) => {
          event.preventDefault();
          navigate(href);
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
