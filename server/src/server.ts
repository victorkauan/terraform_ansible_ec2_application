import fastify from "fastify";

const app = fastify();

app.listen({ port: 2424 }).then(() => {
  console.log("Server is running on http://localhost:2424");
});
