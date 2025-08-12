import { PageType } from "./types";

export interface SetPageOnlyProps {
    setPage: React.Dispatch<React.SetStateAction<PageType>>;
}

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
    size?: "small" | "medium" | "large";
}

export interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    size?: "small" | "medium" | "large" | "extra_large";
}

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: React.HTMLInputTypeAttribute;
  name: string;
  label: string;
  flex?: "column" | "row";
  className?: string;
  rules?: any;
}

export interface FeedbackProps {
    type: "default" | "warning" | "error" | "success";
    message: string;
}

export const FeedbackColors = {
    default: "text-white",
    warning: "text-yellow-500",
    error: "text-red-500",
    success: "text-green-600"
}