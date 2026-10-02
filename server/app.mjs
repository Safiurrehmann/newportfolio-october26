import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { respond, validMessage } from "./bip.mjs";
import { guideAnswer } from "../shared/knowledge.mjs";

export function createApp({ production = false, answer = respond } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: production
        ? {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:"],
              fontSrc: ["'self'"],
              connectSrc: ["'self'"],
              objectSrc: ["'none'"],
              upgradeInsecureRequests: null,
            },
          }
        : false,
      strictTransportSecurity: production ? undefined : false,
    }),
  );
  app.use("/api", express.json({ limit: "16kb" }));
  app.get("/api/status", (_req, res) =>
    res.json({
      mode:
        process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL ? "ai" : "guide",
    }),
  );
  app.use(
    "/api/bip",
    rateLimit({
      windowMs: 60000,
      limit: 12,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: {
        error:
          "A few too many questions at once. Please try again in a minute.",
      },
    }),
  );
  let day = new Date().toISOString().slice(0, 10),
    used = 0;
  app.post("/api/bip", async (req, res) => {
    const origin = req.get("origin");
    const allowed = process.env.SITE_ORIGIN;
    if (production && origin && allowed && origin !== allowed)
      return res.status(403).json({ error: "Origin not allowed." });
    if (!validMessage(req.body))
      return res
        .status(400)
        .json({ error: "Please send a question of 1–1,200 characters." });
    const today = new Date().toISOString().slice(0, 10);
    if (today !== day) {
      day = today;
      used = 0;
    }
    const configuredLimit = Number(process.env.BIP_DAILY_LIMIT ?? 200);
    const limit = Number.isFinite(configuredLimit)
      ? Math.max(0, Math.floor(configuredLimit))
      : 200;
    res.set("Cache-Control", "no-store");
    if (used >= limit)
      return res.json({
        ...guideAnswer(req.body.message),
        notice: "Using the built-in portfolio guide right now.",
      });
    used++;
    try {
      return res.json(
        await answer(req.body.message.trim(), req.body.history ?? []),
      );
    } catch {
      return res
        .status(503)
        .json({
          error: "Bip needs a moment. You can still explore the portfolio.",
        });
    }
  });
  if (production) {
    const dist = fileURLToPath(new URL("../dist/", import.meta.url));
    app.use(express.static(dist, { maxAge: "1h" }));
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/"))
        return res.status(404).json({ error: "Not found" });
      res.sendFile(path.join(dist, "index.html"));
    });
  }
  app.use((err, _req, res, _next) =>
    res
      .status(err.status === 413 ? 413 : 400)
      .json({ error: "Could not read that request." }),
  );
  return app;
}
