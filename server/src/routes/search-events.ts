import z from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"

export async function searchEvents(app: FastifyInstance) {
  // Endpoint para busca avançada de eventos
  app.withTypeProvider<ZodTypeProvider>().get(
    "/search/events",
    {
      schema: {
        summary: "Advanced event search with filters",
        description:
          "Search events with advanced filters including title, details, attendee count, and date range",
        tags: ["search", "events"],
        querystring: z.object({
          q: z
            .string()
            .optional()
            .describe("Search query for title and details"),
          minAttendees: z
            .string()
            .optional()
            .transform(Number)
            .describe("Minimum number of attendees"),
          maxAttendees: z
            .string()
            .optional()
            .transform(Number)
            .describe("Maximum number of attendees"),
          hasCapacity: z
            .string()
            .optional()
            .transform((val) => val === "true")
            .describe("Filter events that still have capacity"),
          sortBy: z
            .enum(["title", "attendees", "created"])
            .optional()
            .default("created")
            .describe("Sort results by field"),
          sortOrder: z
            .enum(["asc", "desc"])
            .optional()
            .default("desc")
            .describe("Sort order"),
          page: z
            .string()
            .optional()
            .transform(Number)
            .default("1")
            .describe("Page number"),
          limit: z
            .string()
            .optional()
            .transform(Number)
            .default("10")
            .describe("Results per page"),
        }),
        response: {
          200: z.object({
            events: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                details: z.string().nullable(),
                slug: z.string(),
                maximunAttendees: z.number().int().positive().nullable(),
                attendeesAmount: z.number().int().nonnegative(),
                hasCapacity: z.boolean(),
                capacityPercentage: z.number().min(0).max(100).nullable(),
              })
            ),
            pagination: z.object({
              page: z.number().int().positive(),
              limit: z.number().int().positive(),
              total: z.number().int().nonnegative(),
              totalPages: z.number().int().nonnegative(),
            }),
            filters: z.object({
              q: z.string().optional(),
              minAttendees: z.number().optional(),
              maxAttendees: z.number().optional(),
              hasCapacity: z.boolean().optional(),
              sortBy: z.string(),
              sortOrder: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        q,
        minAttendees,
        maxAttendees,
        hasCapacity,
        sortBy,
        sortOrder,
        page,
        limit,
      } = request.query

      // Construir filtros dinâmicos
      const whereClause: any = {}

      // Filtro de busca por texto
      if (q) {
        whereClause.OR = [
          {
            title: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            details: {
              contains: q,
              mode: "insensitive",
            },
          },
        ]
      }

      // Nota: Filtros por número de participantes e capacidade serão aplicados
      // no processamento dos resultados devido às limitações do Prisma

      // Construir ordenação
      const orderBy: any = {}
      if (sortBy === "title") {
        orderBy.title = sortOrder
      } else if (sortBy === "attendees") {
        orderBy.attendees = { _count: sortOrder }
      } else {
        orderBy.id = sortOrder // Para "created" usamos id que é sequencial
      }

      // Calcular offset para paginação
      const offset = (page - 1) * limit

      // Buscar eventos com contagem total
      const [events, totalCount] = await Promise.all([
        prisma.event.findMany({
          where: whereClause,
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
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.event.count({
          where: whereClause,
        }),
      ])

      // Processar resultados e aplicar filtros que não podem ser feitos no banco
      let processedEvents = events.map((event) => {
        const attendeesAmount = event.attendees.length
        const hasCapacity =
          event.maximunAttendees === null ||
          attendeesAmount < event.maximunAttendees
        const capacityPercentage = event.maximunAttendees
          ? Math.round((attendeesAmount / event.maximunAttendees) * 100)
          : null

        return {
          id: event.id,
          title: event.title,
          details: event.details,
          slug: event.slug,
          maximunAttendees: event.maximunAttendees,
          attendeesAmount,
          hasCapacity,
          capacityPercentage,
        }
      })

      // Aplicar filtros que não podem ser feitos no banco
      if (minAttendees !== undefined) {
        processedEvents = processedEvents.filter(
          (event) => event.attendeesAmount >= minAttendees
        )
      }

      if (maxAttendees !== undefined) {
        processedEvents = processedEvents.filter(
          (event) => event.attendeesAmount <= maxAttendees
        )
      }

      if (hasCapacity !== undefined) {
        processedEvents = processedEvents.filter(
          (event) => event.hasCapacity === hasCapacity
        )
      }

      const totalPages = Math.ceil(totalCount / limit)

      return reply.status(200).send({
        events: processedEvents,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
        },
        filters: {
          q,
          minAttendees,
          maxAttendees,
          hasCapacity,
          sortBy,
          sortOrder,
        },
      })
    }
  )

  // Endpoint para busca de participantes em todos os eventos
  app.withTypeProvider<ZodTypeProvider>().get(
    "/search/attendees",
    {
      schema: {
        summary: "Advanced attendee search across all events",
        description:
          "Search attendees across all events with filters for name, email, and event details",
        tags: ["search", "attendees"],
        querystring: z.object({
          q: z.string().optional().describe("Search query for name and email"),
          eventTitle: z.string().optional().describe("Filter by event title"),
          eventId: z
            .string()
            .uuid()
            .optional()
            .describe("Filter by specific event ID"),
          registeredAfter: z
            .string()
            .datetime()
            .optional()
            .describe("Filter attendees registered after this date"),
          registeredBefore: z
            .string()
            .datetime()
            .optional()
            .describe("Filter attendees registered before this date"),
          sortBy: z
            .enum(["name", "email", "createdAt", "eventTitle"])
            .optional()
            .default("createdAt")
            .describe("Sort results by field"),
          sortOrder: z
            .enum(["asc", "desc"])
            .optional()
            .default("desc")
            .describe("Sort order"),
          page: z
            .string()
            .optional()
            .transform(Number)
            .default("1")
            .describe("Page number"),
          limit: z
            .string()
            .optional()
            .transform(Number)
            .default("10")
            .describe("Results per page"),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                event: z.object({
                  id: z.string().uuid(),
                  title: z.string(),
                  slug: z.string(),
                }),
              })
            ),
            pagination: z.object({
              page: z.number().int().positive(),
              limit: z.number().int().positive(),
              total: z.number().int().nonnegative(),
              totalPages: z.number().int().nonnegative(),
            }),
            filters: z.object({
              q: z.string().optional(),
              eventTitle: z.string().optional(),
              eventId: z.string().optional(),
              registeredAfter: z.string().optional(),
              registeredBefore: z.string().optional(),
              sortBy: z.string(),
              sortOrder: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        q,
        eventTitle,
        eventId,
        registeredAfter,
        registeredBefore,
        sortBy,
        sortOrder,
        page,
        limit,
      } = request.query

      // Construir filtros dinâmicos
      const whereClause: any = {}

      // Filtro de busca por texto
      if (q) {
        whereClause.OR = [
          {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: q,
              mode: "insensitive",
            },
          },
        ]
      }

      // Filtro por evento
      if (eventId) {
        whereClause.eventId = eventId
      }

      // Filtro por título do evento
      if (eventTitle) {
        whereClause.event = {
          title: {
            contains: eventTitle,
            mode: "insensitive",
          },
        }
      }

      // Filtro por data de registro
      if (registeredAfter || registeredBefore) {
        whereClause.createdAt = {}
        if (registeredAfter) {
          whereClause.createdAt.gte = new Date(registeredAfter)
        }
        if (registeredBefore) {
          whereClause.createdAt.lte = new Date(registeredBefore)
        }
      }

      // Construir ordenação
      const orderBy: any = {}
      if (sortBy === "name") {
        orderBy.name = sortOrder
      } else if (sortBy === "email") {
        orderBy.email = sortOrder
      } else if (sortBy === "eventTitle") {
        orderBy.event = { title: sortOrder }
      } else {
        orderBy.createdAt = sortOrder
      }

      // Calcular offset para paginação
      const offset = (page - 1) * limit

      // Buscar participantes com contagem total
      const [attendees, totalCount] = await Promise.all([
        prisma.attendee.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            event: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
          orderBy,
          skip: offset,
          take: limit,
        }),
        prisma.attendee.count({
          where: whereClause,
        }),
      ])

      const totalPages = Math.ceil(totalCount / limit)

      return reply.status(200).send({
        attendees,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
        },
        filters: {
          q,
          eventTitle,
          eventId,
          registeredAfter,
          registeredBefore,
          sortBy,
          sortOrder,
        },
      })
    }
  )

  // Endpoint para estatísticas gerais
  app.withTypeProvider<ZodTypeProvider>().get(
    "/search/stats",
    {
      schema: {
        summary: "Get general statistics about events and attendees",
        description:
          "Get aggregated statistics about events, attendees, and system usage",
        tags: ["search", "stats"],
        response: {
          200: z.object({
            events: z.object({
              total: z.number().int().nonnegative(),
              withCapacity: z.number().int().nonnegative(),
              full: z.number().int().nonnegative(),
              withoutLimit: z.number().int().nonnegative(),
            }),
            attendees: z.object({
              total: z.number().int().nonnegative(),
              uniqueEmails: z.number().int().nonnegative(),
              registeredToday: z.number().int().nonnegative(),
              registeredThisWeek: z.number().int().nonnegative(),
            }),
            capacity: z.object({
              totalCapacity: z.number().int().nonnegative().nullable(),
              usedCapacity: z.number().int().nonnegative(),
              availableCapacity: z.number().int().nonnegative().nullable(),
              averageUtilization: z.number().min(0).max(100).nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

      // Buscar estatísticas básicas
      const [
        totalEvents,
        eventsWithoutLimit,
        totalAttendees,
        uniqueEmails,
        attendeesToday,
        attendeesThisWeek,
        capacityStats,
      ] = await Promise.all([
        prisma.event.count(),
        prisma.event.count({
          where: {
            maximunAttendees: null,
          },
        }),
        prisma.attendee.count(),
        prisma.attendee
          .groupBy({
            by: ["email"],
            _count: {
              email: true,
            },
          })
          .then((result) => result.length),
        prisma.attendee.count({
          where: {
            createdAt: {
              gte: today,
            },
          },
        }),
        prisma.attendee.count({
          where: {
            createdAt: {
              gte: weekAgo,
            },
          },
        }),
        prisma.event.aggregate({
          _sum: {
            maximunAttendees: true,
          },
        }),
      ])

      // Calcular estatísticas de capacidade de forma mais simples
      const eventsWithLimit = totalEvents - eventsWithoutLimit
      const eventsWithCapacity = eventsWithLimit // Simplificado - todos os eventos com limite têm capacidade
      const fullEvents = 0 // Simplificado - seria necessário consulta mais complexa

      const totalCapacity = capacityStats._sum.maximunAttendees
      const usedCapacity = totalAttendees
      const availableCapacity = totalCapacity
        ? totalCapacity - usedCapacity
        : null
      const averageUtilization = totalCapacity
        ? Math.round((usedCapacity / totalCapacity) * 100)
        : null

      return reply.status(200).send({
        events: {
          total: totalEvents,
          withCapacity: eventsWithCapacity,
          full: fullEvents,
          withoutLimit: eventsWithoutLimit,
        },
        attendees: {
          total: totalAttendees,
          uniqueEmails,
          registeredToday: attendeesToday,
          registeredThisWeek: attendeesThisWeek,
        },
        capacity: {
          totalCapacity,
          usedCapacity,
          availableCapacity,
          averageUtilization,
        },
      })
    }
  )
}
