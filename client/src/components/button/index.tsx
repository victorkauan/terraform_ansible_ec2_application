import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "text-sm font-semibold text-center w-full min-h-8 px-2.5 py-1.5 border rounded-lg flex items-center justify-center hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      color: {
        primary: "text-white bg-black border-black hover:bg-neutral-800",
        secondary: "border-neutral-200 hover:bg-neutral-100",
        transparent: "border-transparent hover:bg-neutral-100",
      },
    },
    defaultVariants: {
      color: "primary",
    },
  }
);

type TButtonProps = VariantProps<typeof buttonVariants>;

type TProps = TButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ color, ...props }: TProps) {
  return <button className={buttonVariants({ color })} {...props} />;
}
