import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-event.ts
import z from "zod";
async function getEvent(app) {
  app.withTypeProvider().get(
    "/events/:eventId",
    {
      schema: {
        summary: "Get an Event",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          200: z.object({
            event: z.object({
              title: z.string().min(4),
              details: z.string().nullable(),
              maximunAttendees: z.number().int().positive().nullable(),
              attendeesAmount: z.number().int().positive().nullable()
            })
          }),
          409: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const params = request.params;
      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          details: true,
          slug: true,
          maximunAttendees: true,
          _count: {
            select: {
              attendees: true
            }
          }
        },
        where: {
          id: params.eventId
        }
      });
      if (event === null) {
        return reply.status(409).send({ message: "Evento n\xE3o encontrado" });
      }
      return reply.status(200).send({
        event: {
          title: event.title,
          details: event.details,
          maximunAttendees: event.maximunAttendees,
          attendeesAmount: event._count.attendees
        }
      });
    }
  );
}

export {
  getEvent
};
