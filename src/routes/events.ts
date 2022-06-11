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
      if (!req.body.votes || !req.body.eventid)
        return next(createError(400, "Invalid proposition details"));

      let voteCounts = false;
      if (req.body.votes.length) {
        voteCounts = true;
      }

      const votes = req.body.votes;

      await prisma.vote.createMany({
        data: votes,
      });

      // Update the vote count on the event if we have > 0 votes
      if (voteCounts) {
        await prisma.event.update({
          where: {
            id: req.body.eventid,
          },
          data: {
            voteCount: {
              increment: 1,
            },
          },
        });
      }

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

      const event = await prisma.event.findUnique({
        where: {
          id,
        },
      });

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

      if (!event) return res.sendStatus(404);

      res.json(event).status(200);
    } catch (err) {
      next(err);
    }
  }
);

export default EventRouter;
