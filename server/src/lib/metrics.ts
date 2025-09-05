import { register, Counter, Histogram, Gauge } from "prom-client"

// Contador de requisições HTTP por endpoint
export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
})

// Histograma de duração das requisições
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
})

// Gauge para tempo máximo das requisições
export const httpServerRequestsSecondsMax = new Gauge({
  name: "http_server_requests_seconds_max",
  help: "Maximum duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
})

// Map para rastrear os valores máximos por combinação de labels
const maxDurationMap = new Map<string, number>()

// Função para atualizar o tempo máximo
const updateMaxDuration = (
  method: string,
  route: string,
  statusCode: string,
  duration: number
) => {
  const labelKey = `${method}:${route}:${statusCode}`
  const currentMax = maxDurationMap.get(labelKey) || 0

  if (duration > currentMax) {
    maxDurationMap.set(labelKey, duration)
    httpServerRequestsSecondsMax.set(
      { method, route, status_code: statusCode },
      duration
    )
    console.log(
      `New max duration: ${method} ${route} ${statusCode} = ${duration}s`
    )
  }
}

// Contador de eventos criados
export const eventsCreatedTotal = new Counter({
  name: "events_created_total",
  help: "Total number of events created",
})

// Contador de participantes registrados
export const attendeesRegisteredTotal = new Counter({
  name: "attendees_registered_total",
  help: "Total number of attendees registered",
  labelNames: ["event_id"],
})

// Gauge para número atual de eventos
export const eventsActive = new Gauge({
  name: "events_active",
  help: "Current number of active events",
})

// Gauge para número atual de participantes
export const attendeesActive = new Gauge({
  name: "attendees_active",
  help: "Current number of active attendees",
})

// Contador de erros por tipo
export const errorsTotal = new Counter({
  name: "errors_total",
  help: "Total number of errors",
  labelNames: ["error_type", "endpoint"],
})

// Histograma de duração das queries do banco
export const databaseQueryDuration = new Histogram({
  name: "database_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["operation", "table"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
})

// Gauge para conexões ativas do banco
export const databaseConnectionsActive = new Gauge({
  name: "database_connections_active",
  help: "Current number of active database connections",
})

// Métricas padrão do sistema
export const processStartTime = new Gauge({
  name: "process_start_time_seconds",
  help: "Start time of the process since unix epoch in seconds",
})

// Middleware para capturar métricas automaticamente
export const metricsMiddleware = async (request: any, reply: any) => {
  const start = Date.now()

  // Captura o tempo de resposta
  reply.addHook("onResponse", (request: any, reply: any) => {
    const duration = (Date.now() - start) / 1000
    const method = request.method
    const route = request.routeOptions?.url || request.url
    const statusCode = reply.statusCode

    // Incrementa contador de requisições
    httpRequestsTotal.inc({ method, route, status_code: statusCode })

    // Registra duração da requisição
    httpRequestDuration.observe(
      { method, route, status_code: statusCode },
      duration
    )

    // Atualiza tempo máximo da requisição
    updateMaxDuration(method, route, statusCode.toString(), duration)
  })
}

// Função para obter métricas em formato Prometheus
export const getMetrics = async () => {
  return await register.metrics()
}

// Função para resetar métricas (útil para testes)
export const resetMetrics = () => {
  register.clear()
  maxDurationMap.clear()
}

// Função para obter métricas máximas atuais
export const getMaxDurations = () => {
  return Object.fromEntries(maxDurationMap)
}

// Inicializar métricas do sistema
processStartTime.set(Math.floor(Date.now() / 1000))
