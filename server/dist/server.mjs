import {
  registerForEvent
} from "./chunk-TWALDYY3.mjs";
import {
  createEvent
} from "./chunk-G3OJECWO.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getMetrics
} from "./chunk-Y7FYF6KI.mjs";
import {
  getAttendeeBadge
} from "./chunk-WXXCDBEQ.mjs";
import {
  getEventAttendees
} from "./chunk-JFCAI4FH.mjs";
import {
  getEvent
} from "./chunk-N3O7ASUB.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import "dotenv/config";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform
} from "fastify-type-provider-zod";
var app = fastify();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Event Registration API",
      description: "API for managing event registrations",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});
app.get("/metrics", async (request, reply) => {
  reply.type("text/plain");
  return await getMetrics();
});
app.get("/prometheus-metrics", async (request, reply) => {
  reply.type("text/plain");
  return await getMetrics();
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(getEventAttendees);
app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
  console.log(`Swagger docs available at ${address}/docs`);
  console.log(`Prometheus metrics available at ${address}/metrics`);
  console.log(`Custom metrics available at ${address}/prometheus-metrics`);
});
