import z from "zod"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import {
  attendeesRegisteredTotal,
  attendeesActive,
  errorsTotal,
} from "../lib/metrics"

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Register an attendee for an event",
        tags: ["attendees"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { eventId } = request.params
        const { name, email } = request.body

        const attendeeFromEmail = await prisma.attendee.findUnique({
          where: {
            eventId_email: {
              email,
              eventId,
            },
          },
        })

        if (attendeeFromEmail !== null) {
          errorsTotal.inc({
            error_type: "duplicate_email",
            endpoint: "/events/:eventId/attendees",
          })
          return reply.status(400).send({
            message: "This e-mail is already registered for this event.",
          })
        }

        const [event, amountOfAttendeesForEvent] = await Promise.all([
          prisma.event.findUnique({
            where: {
              id: eventId,
            },
          }),
          prisma.attendee.count({
            where: {
              eventId,
            },
          }),
        ])

        if (event === null) {
          errorsTotal.inc({
            error_type: "event_not_found",
            endpoint: "/events/:eventId/attendees",
          })
          return reply.status(404).send({
            message: "Event not found.",
          })
        }

        if (
          event.maximunAttendees &&
          amountOfAttendeesForEvent >= event.maximunAttendees
        ) {
          errorsTotal.inc({
            error_type: "event_full",
            endpoint: "/events/:eventId/attendees",
          })
          return reply.status(400).send({
            message:
              "The maximum number of attendees for this event has been reached.",
          })
        }

        const attendee = await prisma.attendee.create({
          data: {
            name,
            email,
            eventId,
          },
        })

        // Incrementar métricas
        attendeesRegisteredTotal.inc({ event_id: eventId })

        // Atualizar contador de participantes ativos
        const activeAttendeesCount = await prisma.attendee.count()
        attendeesActive.set(activeAttendeesCount)

        return reply.status(201).send({
          attendeeId: attendee.id,
        })
      } catch (error) {
        errorsTotal.inc({
          error_type: "registration_error",
          endpoint: "/events/:eventId/attendees",
        })
        throw error
      }
    }
  )
}
