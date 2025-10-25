import type { TextareaHTMLAttributes } from "react";

type TProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea(props: TProps) {
  return (
    <textarea
      className="text-sm w-full px-3 py-1.5 rounded-md border border-neutral-200"
      {...props}
    />
  );
}
