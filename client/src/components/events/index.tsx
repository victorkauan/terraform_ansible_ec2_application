import { useQuery } from "@tanstack/react-query";
import indexEvents from "../../services/event/applications/index-events.service";
import EventCard from "./event-card";

export default function Events() {
  const { isLoading, data } = useQuery({
    queryKey: ["index-events"],
    queryFn: indexEvents,
  });

  if (isLoading || !data) {
    return <p>Carregando...</p>;
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  );
}
