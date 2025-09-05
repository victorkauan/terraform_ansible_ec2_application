import z from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"

export async function getEvent(app: FastifyInstance) {
  // Endpoint para buscar todos os eventos
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events",
    {
      schema: {
        summary: "Get all Events",
        tags: ["events"],
        response: {
          200: z.object({
            events: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string().min(4),
                details: z.string().nullable(),
                slug: z.string(),
                maximunAttendees: z.number().int().positive().nullable(),
                attendeesAmount: z.number().int().nonnegative(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const events = await prisma.event.findMany({
        select: {
          id: true,
          title: true,
          details: true,
          slug: true,
          maximunAttendees: true,
          attendees: {
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      })

      return reply.status(200).send({
        events: events.map((event) => ({
          id: event.id,
          title: event.title,
          details: event.details,
          slug: event.slug,
          maximunAttendees: event.maximunAttendees,
          attendeesAmount: event.attendees.length,
        })),
      })
    }
  )

  // Endpoint para buscar um evento específico
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId",
    {
      schema: {
        summary: "Get an Event",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            event: z.object({
              title: z.string().min(4),
              details: z.string().nullable(),
              maximunAttendees: z.number().int().positive().nullable(),
              attendeesAmount: z.number().int().nonnegative().nullable(),
            }),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const params = request.params

      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          details: true,
          slug: true,
          maximunAttendees: true,
          _count: {
            select: {
              attendees: true,
            },
          },
        },
        where: {
          id: params.eventId,
        },
      })

      if (event === null) {
        return reply.status(409).send({ message: "Evento não encontrado" })
      }

      return reply.status(200).send({
        event: {
          title: event.title,
          details: event.details,
          maximunAttendees: event.maximunAttendees,
          attendeesAmount: event._count?.attendees ?? 0,
        },
      })
    }
  )
}
