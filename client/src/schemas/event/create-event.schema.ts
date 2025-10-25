import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  details: z.string().min(1, "Detalhes são obrigatórios"),
  maximunAttendees: z
    .number({ message: "Máximo de participantes deve ser um número válido" })
    .int("Máximo de participantes deve ser um número inteiro")
    .min(1, "Máximo de participantes deve ser pelo menos 1"),
});

export type TCreateEventForm = z.infer<typeof createEventSchema>;
