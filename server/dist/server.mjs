import {
  createEvent
} from "./chunk-VDTIMRFL.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-WXXCDBEQ.mjs";
import {
  getEventAttendees
} from "./chunk-JFCAI4FH.mjs";
import {
  getEvent
} from "./chunk-JRNT2BT2.mjs";
import {
  registerForEvent
} from "./chunk-BIAM75WB.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform
} from "fastify-type-provider-zod";
var app = fastify();
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
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(getEventAttendees);
app.listen({ port: 2424, host: "0.0.0.0" }).then(() => {
  console.log("Server is running on http://localhost:2424/docs");
});
