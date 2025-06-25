/*
  Warnings:

  - You are about to drop the column `parentId` on the `question` table. All the data in the column will be lost.
  - You are about to alter the column `statut` on the `ticket` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- DropForeignKey
ALTER TABLE `question` DROP FOREIGN KEY `question_parentId_fkey`;

-- DropIndex
DROP INDEX `question_parentId_idx` ON `question`;

-- AlterTable
ALTER TABLE `question` DROP COLUMN `parentId`,
    ADD COLUMN `faqId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ticket` MODIFY `statut` ENUM('ouvert', 'traite', 'en_attente') NOT NULL DEFAULT 'ouvert';

-- CreateTable
CREATE TABLE `faq` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_faqId_fkey` FOREIGN KEY (`faqId`) REFERENCES `faq`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
