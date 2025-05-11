import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {},
      },
    },
    async (request, reply) => {
      const params = request.params;

      const attendee = await prisma.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            },
          },
        },
        where: {
          id: params.attendeeId,
        },
      });

      if (attendee === null) {
        return reply.status(404).send({ message: "Inscrição não encontrada" });
      }

      return reply.status(200).send({ attendee });
    }
  );
}
