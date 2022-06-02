-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposition" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "allday" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Proposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "propositionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Proposition_id_key" ON "Proposition"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_propositionId_key" ON "Vote"("propositionId");

-- AddForeignKey
ALTER TABLE "Proposition" ADD CONSTRAINT "Proposition_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_propositionId_fkey" FOREIGN KEY ("propositionId") REFERENCES "Proposition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
