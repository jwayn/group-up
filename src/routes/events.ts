import { NextFunction, Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

import createError from "http-errors";

type Proposition = {
  eventId: string;
  datetime: Date;
  allday: Boolean | string;
};

const EventRouter = Router();

EventRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.name || !req.body.propositions.length)
        return next(createError(400, "Invalid event details"));

      const urlstring = randomBytes(Math.ceil(8 / 2))
        .toString("hex")
        .slice(0, 8);
      const event = await prisma.event.create({
        data: {
          name: req.body.name,
          url: urlstring,
        },
      });

      const propositions = req.body.propositions.map((prop: Proposition) => {
        prop.datetime = new Date(prop.datetime);
        prop.eventId = event.id;
        prop.allday = prop.allday === "true";
        return prop;
      });

      await prisma.proposition.createMany({
        data: propositions,
      });

      res.json(event);
    } catch (err) {
      next(err);
    }
  }
);

EventRouter.post(
  "/vote",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.votes)
        return next(createError(400, "Invalid proposition details"));

      const votes = req.body.votes;
      console.log(votes);
      await prisma.vote.createMany({
        data: votes,
      });

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

EventRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let id: string;
      if (req.query && req.query.id) {
        id = (req.query as any).id;
      } else {
        return next(createError(400, "Invalid event details"));
      }

      console.log(id);
      const event = await prisma.event.findUnique({
        where: {
          id,
        },
      });

      console.log(event);

      res.json(event).status(200);
    } catch (err) {
      next(err);
    }
  }
);

EventRouter.get(
  "/:eventurl",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.eventurl)
        return next(createError(400, "Invalid event details"));

      const event = await prisma.event.findUnique({
        where: {
          url: req.params.eventurl,
        },
        include: {
          propositions: {
            include: {
              _count: {
                select: { votes: true },
              },
            },
          },
        },
      });

      res.json(event).status(200);
    } catch (err) {
      next(err);
    }
  }
);

export default EventRouter;
