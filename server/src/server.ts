import fastify from "fastify"
import "dotenv/config"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUI from "@fastify/swagger-ui"
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod"

import { createEvent } from "./routes/create-event"
import { registerForEvent } from "./routes/register-for-event"
import { getEvent } from "./routes/get-event"
import { getAttendeeBadge } from "./routes/get-attendee-badge"
import { getEventAttendees } from "./routes/get-event-attendees"
import { searchEvents } from "./routes/search-events"
import {
  getMetrics,
  httpRequestsTotal,
  httpRequestDuration,
} from "./lib/metrics"

const app = fastify()

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000

// Middleware para capturar métricas HTTP automaticamente
app.addHook("onRequest", async (request, reply) => {
  const start = Date.now()

  // Armazena o tempo de início na request para usar no onResponse
  ;(request as any).startTime = start
})

app.addHook("onResponse", async (request, reply) => {
  const startTime = (request as any).startTime
  if (startTime) {
    const duration = (Date.now() - startTime) / 1000
    const method = request.method
    const route = request.routeOptions?.url || request.url
    const statusCode = reply.statusCode

    // Incrementa contador de requisições
    httpRequestsTotal.inc({ method, route, status_code: statusCode })

    // Registra duração da requisição
    httpRequestDuration.observe({ method, route }, duration)
  }
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Event Registration API",
      description: "API for managing event registrations",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
})

// Endpoint para métricas do Prometheus
app.get("/metrics", async (request, reply) => {
  reply.type("text/plain")
  return await getMetrics()
})

// Endpoint customizado para métricas (alternativo)
app.get("/prometheus-metrics", async (request, reply) => {
  reply.type("text/plain")
  return await getMetrics()
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(getEventAttendees)
app.register(searchEvents)

app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server is running at ${address}`)
  console.log(`Swagger docs available at ${address}/docs`)
  console.log(`Prometheus metrics available at ${address}/metrics`)
  console.log(`Custom metrics available at ${address}/prometheus-metrics`)
})
