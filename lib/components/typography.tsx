import { HeaderProps, ParagraphProps } from "../interfaces";

export function Text({ children, size = "medium", className, ...props }: ParagraphProps) {
  const sizeClasses = {
    small: "text-sm",
    medium: "text-md",
    large: "text-lg",
  };

  return (
    <p
      className={`${sizeClasses[size]} ${className || ""}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function Header({ children, size = "extra_large", className, ...props }: HeaderProps) {
  const sizeClasses = {
    small: "text-sm",
    medium: "text-md",
    large: "text-lg",
    extra_large: "text-2xl",
  };

  return (
    <h1
      className={`${sizeClasses[size]} font-semibold ${className || ""}`}
      {...props}
    >
      {children}
    </h1>
  );
}
