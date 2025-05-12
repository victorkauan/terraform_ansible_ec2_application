import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-attendee-badge.ts
import z from "zod";
async function getAttendeeBadge(app) {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Get an attendee badge",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {}
      }
    },
    async (request, reply) => {
      const params = request.params;
      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true
            }
          }
        },
        where: {
          id: params.attendeeId
        }
      });
      if (attendee === null) {
        return reply.status(404).send({ message: "Inscri\xE7\xE3o n\xE3o encontrada" });
      }
      return reply.status(200).send({ attendee });
    }
  );
}

export {
  getAttendeeBadge
};
