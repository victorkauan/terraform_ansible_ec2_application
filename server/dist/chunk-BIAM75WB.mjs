import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/register-for-event.ts
import z from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Register an attendee for an event",
        tags: ["attendees"],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email({ message: "Formato de email inv\xE1lido" })
        }),
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          201: z.object({
            attendeeId: z.number()
          }),
          409: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const params = request.params;
      const data = request.body;
      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            eventId: params.eventId,
            email: data.email
          }
        }
      });
      if (attendeeFromEmail !== null) {
        return reply.status(409).send({ message: "Voc\xEA j\xE1 est\xE1 inscrito nesse evento" });
      }
      const [event, amountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: params.eventId
          }
        }),
        prisma.attendee.count({
          where: {
            eventId: params.eventId
          }
        })
      ]);
      if (event?.maximunAttendees && amountOfAttendeesForEvent > event?.maximunAttendees) {
        return reply.status(409).send({ message: "Evento Lotado" });
      }
      const attendee = await prisma.attendee.create({
        data: {
          name: data.name,
          email: data.email,
          eventId: params.eventId
        }
      });
      return reply.status(201).send({ attendeeId: attendee.id });
    }
  );
}

export {
  registerForEvent
};
