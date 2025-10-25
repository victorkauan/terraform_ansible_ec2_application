import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import PeopleIcon from "@mui/icons-material/People";
import viewEvent from "../../services/event/applications/view-event.service";
import AttendeeCard from "./attendee-card";
import indexEventAttendees from "../../services/event/applications/index-event-attendees.service";
import type { TAttendee } from "../../services/event/entities/attendee.type";

export default function ViewEvent() {
  const { id } = useParams();

  const { isLoading: isViewEventLoading, data: viewEventData } = useQuery({
    queryKey: ["view-event", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Event ID is required");
      }

      return viewEvent({ id });
    },
  });

  const {
    isLoading: isIndexEventAttendeesLoading,
    data: indexEventAttendeesData,
  } = useQuery({
    queryKey: ["index-event-attendees", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Event ID is required");
      }

      return indexEventAttendees({ eventId: id });
    },
  });

  if (
    isViewEventLoading ||
    !viewEventData ||
    isIndexEventAttendeesLoading ||
    !indexEventAttendeesData
  ) {
    return <p>Carregando...</p>;
  }

  function renderAttendees(attendees: TAttendee[]) {
    if (attendees.length === 0) {
      return (
        <li>
          <p className="text-neutral-600 text-sm">
            Nenhum participado registrado.
          </p>
        </li>
      );
    }

    return attendees.map((attendee) => (
      <li key={`attendee-${attendee.id}`}>
        <AttendeeCard attendee={attendee} />
      </li>
    ));
  }

  return (
    <div className="px-6 py-5 border border-neutral-200 rounded-xl shadow flex flex-col gap-6">
      <div>
        <h2 className="text-neutral-600 text-sm font-semibold mb-2">
          Detalhes do evento
        </h2>
        <h3 className="text-xl font-semibold mb-2">
          {viewEventData.event.title}
        </h3>
        <p className="text-neutral-600 mb-5">{viewEventData.event.details}</p>
        <p className="text-sm flex items-center gap-2">
          <PeopleIcon fontSize="small" className="text-neutral-600" />
          <span>
            {viewEventData.event.attendeesAmount}/
            {viewEventData.event.maximunAttendees} registrados
          </span>
        </p>
      </div>
      <hr className="border-none h-px bg-neutral-200" />
      <div>
        <h2 className="text-neutral-600 text-sm font-semibold mb-2">
          Participantes do evento
        </h2>
        <ul>{renderAttendees(indexEventAttendeesData.attendees)}</ul>
      </div>
    </div>
  );
}
