import { createApp } from "./app.mjs";
const production = process.argv.includes("--production");
const port = Number(process.env.PORT || 4318);
const server = createApp({ production }).listen(
  port,
  process.env.HOST || "127.0.0.1",
  () =>
    console.log(
      `Safi portfolio ${production ? "site" : "Bip API"} ready at http://localhost:${port}`,
    ),
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => server.close(() => process.exit(0)));
