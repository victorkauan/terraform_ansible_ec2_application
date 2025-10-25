import api from "../../../api";
import type { TIndexEventAttendeesRequest } from "../entities/index-event-attendees.request.type";
import type { TIndexEventAttendeesResponse } from "../entities/index-event-attendees.response.type";

export default async function indexEventAttendees(input: TIndexEventAttendeesRequest) {
  const { data } = await api.get<TIndexEventAttendeesResponse>(`/events/${input.eventId}/attendees`);
  return data;
}
