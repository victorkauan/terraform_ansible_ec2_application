import { Link, type To } from "react-router";
import WestIcon from "@mui/icons-material/West";

type TProps = { to: To; message: string };

export default function BackButton({ to, message }: TProps) {
  return (
    <Link
      to={to}
      className="text-neutral-600 text-sm mb-6 flex items-center gap-2 transition-colors hover:text-black"
    >
      <WestIcon fontSize="inherit" />
      <span>{message}</span>
    </Link>
  );
}
