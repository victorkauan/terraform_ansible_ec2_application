import {
  generateSlug
} from "./chunk-KDMJHR3Z.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-event.ts
import z from "zod";
async function createEvent(app) {
  app.withTypeProvider().post(
    "/events",
    {
      schema: {
        summary: "Create an Event",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximunAttendees: z.number().int().positive().nullable()
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid()
          })
        }
      }
    },
    async (request, reply) => {
      const data = request.body;
      const slug = generateSlug(data.title);
      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug
        }
      });
      if (eventWithSameSlug !== null) {
        throw new Error("J\xE1 existe outro evento com esse t\xEDtulo");
      }
      const event = await prisma.event.create({
        data: {
          title: data.title,
          details: data.details,
          maximunAttendees: data.maximunAttendees,
          slug
        }
      });
      return reply.status(201).send({ eventId: event.id });
    }
  );
}

export {
  createEvent
};
