import api from "../../../api";
import type { TViewEventRequest } from "../entities/view-event.request.type";
import type { TViewEventResponse } from "../entities/view-event.response.type";

export default async function viewEvent(input: TViewEventRequest) {
  const { data } = await api.get<TViewEventResponse>(`/events/${input.id}`);
  return data;
}
