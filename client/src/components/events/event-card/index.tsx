import PeopleIcon from "@mui/icons-material/People";
import type { TEvent } from "../../../services/event/entities/event.type";

type TProps = { event: TEvent };

export default function EventCard({ event }: TProps) {
  return (
    <article className="px-6 py-5 border border-neutral-200 rounded-xl shadow transition-shadow hover:shadow-md">
      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
      <p className="text-neutral-600 mb-5">{event.details}</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm flex items-center gap-2">
          <PeopleIcon fontSize="small" className="text-neutral-600" />
          <span>
            {event.attendeesAmount}/{event.maximunAttendees} registrados
          </span>
        </p>
        <a
          href={`/events/${event.id}`}
          className="text-white text-sm font-semibold text-center bg-black min-h-8 px-2.5 py-1.5 rounded-lg flex items-center justify-center hover:bg-neutral-800"
        >
          Ver detalhes
        </a>
      </div>
    </article>
  );
}
