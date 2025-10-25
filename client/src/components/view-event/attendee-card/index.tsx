import PersonIcon from "@mui/icons-material/Person";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import type { TAttendee } from "../../../services/event/entities/attendee.type";

type TProps = { attendee: TAttendee };

export default function AttendeeCard({ attendee }: TProps) {
  return (
    <article className="text-neutral-600 font-semibold text-sm px-3.5 py-2.5 border border-neutral-200 rounded-md shadow flex flex-col gap-1">
      <h4 className="flex items-center gap-2">
        <PersonIcon fontSize="small" />
        <span>{attendee.name}</span>
      </h4>
      <p className="flex items-center gap-2">
        <MailOutlineIcon fontSize="small" />
        <span>{attendee.email}</span>
      </p>
    </article>
  );
}
