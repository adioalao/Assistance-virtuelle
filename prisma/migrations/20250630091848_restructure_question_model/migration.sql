/*
  Warnings:

  - You are about to drop the column `orderInChat` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Question` DROP COLUMN `orderInChat`,
    ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Question`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
