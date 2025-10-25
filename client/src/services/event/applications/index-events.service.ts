import api from "../../../api";
import type { TIndexEventsResponse } from "../entities/index-events.response.type";

export default async function indexEvents() {
  const { data } = await api.get<TIndexEventsResponse>("/events");
  return data;
}
