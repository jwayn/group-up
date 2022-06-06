// Import the express in typescript file
import express from "express";
import cors from "cors";
import { join } from "node:path";

import EventRouter from "./routes/events";

// Initialize the express engine
const app: express.Application = express();

// Take a port 3000 for running server.
const port: number = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("src/public"));

// Routes
app.use("/api/event", EventRouter);
app.use(express.static(__dirname + "/public"));
app.get("*", (req, res) => {
  res.sendFile(join(__dirname + "/public/index.html"));
});

// Server setup
app.listen(port, () => {
  console.log(`TypeScript with Express
         http://localhost:${port}/`);
});
