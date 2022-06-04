import { NextFunction, Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
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

      const event = await prisma.event.create({
        data: {
          name: req.body.name,
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
      if (!req.body.id) return next(createError(400, "Invalid event details"));

      const event = await prisma.event.findUnique({
        where: {
          id: req.body.id,
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

EventRouter.post(
  "/vote/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.propId)
        return next(createError(400, "Invalid proposition details"));

      await prisma.vote.create({
        data: {
          propositionId: req.body.propId,
        },
      });

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  }
);

export default EventRouter;
