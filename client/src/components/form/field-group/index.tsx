import type { ReactNode } from "react";

type TProps = { children: ReactNode };

export default function FieldGroup({ children }: TProps) {
  return <div className="flex flex-col gap-1">{children}</div>;
}
