/*
  Warnings:

  - You are about to drop the column `messageId` on the `Question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_messageId_fkey`;

-- DropIndex
DROP INDEX `Question_messageId_fkey` ON `Question`;

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `questionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `messageId`;

-- CreateIndex
CREATE INDEX `Message_questionId_idx` ON `Message`(`questionId`);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
