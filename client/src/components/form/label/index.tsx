import type { LabelHTMLAttributes } from "react";

type TProps = {
  label: string;
  required?: boolean;
} & LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ label, required = false, ...props }: TProps) {
  return (
    <label className="text-sm font-semibold" {...props}>
      {label} {required && <span className="text-red-600">*</span>}
    </label>
  );
}
