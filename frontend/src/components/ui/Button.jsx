import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * Universal Button primitive matching design tokens & specifications.
 * Source of Truth: reference image & forensic_audit.md §7 & §9
 */
export const Button = React.forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    label,
    icon: IconComponent,
    iconPosition = 'right',
    href,
    onClick,
    className,
    children,
    ...props
  },
  ref
) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-button transition-all duration-200 ease-smooth focus-visible:outline-2 focus-visible:outline-accent-500 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-accent-500/50 select-none whitespace-nowrap';

  const variants = {
    primary:
      'bg-accent-500 text-text-inverse shadow-glow-cyan hover:bg-accent-400 hover:shadow-glow-cyan-hover hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]',
    ghost:
      'border border-border-emphasis bg-transparent text-text-primary hover:border-accent-500/60 hover:bg-accent-500/10 hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]',
    'nav-ghost':
      'w-[88px] h-[40px] text-[14px] font-medium border border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/5 active:scale-[0.98]',
    'nav-primary':
      'w-[96px] h-[40px] text-[14px] font-semibold bg-[#00d4ff] text-white hover:bg-[#1adbff] hover:shadow-[0_0_16px_rgba(0,212,255,0.35)] active:scale-[0.98]',
  };

  const sizes = {
    sm: 'h-8 px-3 text-caption',
    md: 'h-10 px-4 text-body-sm',
    lg: 'h-12 px-7 text-body-md',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = variant.startsWith('nav-') ? '' : sizes[size] || sizes.md;

  const content = (
    <>
      {IconComponent && iconPosition === 'left' && (
        <IconComponent className="w-4 h-4 mr-2 transition-transform duration-200" />
      )}
      <span>{label || children}</span>
      {IconComponent && iconPosition === 'right' && (
        <IconComponent className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </>
  );

  if (href) {
    if (href.startsWith('/')) {
      return (
        <Link
          ref={ref}
          to={href}
          className={cn(baseStyles, variantClass, sizeClass, 'group', className)}
          {...props}
        >
          {content}
        </Link>
      );
    }
    return (
      <a
        ref={ref}
        href={href}
        className={cn(baseStyles, variantClass, sizeClass, 'group', className)}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={cn(baseStyles, variantClass, sizeClass, 'group', className)}
      {...props}
    >
      {content}
    </button>
  );
});
