import api from "../../../api";
import type { TStoreEventRequest } from "../entities/store-event.request.type";
import type { TStoreEventResponse } from "../entities/store-event.response.type";

export default async function storeEvent(input: TStoreEventRequest) {
  const { data } = await api.post<TStoreEventResponse>("/events", input);
  return data;
}
