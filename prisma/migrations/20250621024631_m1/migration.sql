/*
  Warnings:

  - A unique constraint covering the columns `[questionId]` on the table `reponse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `reponse_questionId_key` ON `reponse`(`questionId`);
