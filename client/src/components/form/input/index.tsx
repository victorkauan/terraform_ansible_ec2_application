import type { InputHTMLAttributes } from "react";

type TProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: TProps) {
  return (
    <input
      className="text-sm w-full px-3 py-1.5 rounded-md border border-neutral-200"
      {...props}
    />
  );
}
