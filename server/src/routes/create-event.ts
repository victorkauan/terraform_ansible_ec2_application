import z from "zod"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { generateSlug } from "../utils/generate-slug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { eventsCreatedTotal, eventsActive, errorsTotal } from "../lib/metrics"

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        summary: "Create an Event",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximunAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const data = request.body

        const slug = generateSlug(data.title)

        const eventWithSameSlug = await prisma.event.findUnique({
          where: {
            slug,
          },
        })

        if (eventWithSameSlug !== null) {
          errorsTotal.inc({ error_type: "duplicate_slug", endpoint: "/events" })
          throw new Error("Já existe outro evento com esse título")
        }

        const event = await prisma.event.create({
          data: {
            title: data.title,
            details: data.details,
            maximunAttendees: data.maximunAttendees,
            slug,
          },
        })

        // Incrementar métricas
        eventsCreatedTotal.inc()

        // Atualizar contador de eventos ativos
        const activeEventsCount = await prisma.event.count()
        eventsActive.set(activeEventsCount)

        return reply.status(201).send({ eventId: event.id })
      } catch (error) {
        errorsTotal.inc({ error_type: "creation_error", endpoint: "/events" })
        throw error
      }
    }
  )
}
