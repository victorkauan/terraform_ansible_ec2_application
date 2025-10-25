type TProps = { message: string };

export default function ErrorMessage({ message }: TProps) {
  return <span className="text-xs font-semibold text-red-600">{message}</span>;
}
