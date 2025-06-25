-- AlterTable
ALTER TABLE `question` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdByAdmin` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `faqRootId` INTEGER NULL,
    ADD COLUMN `isFaq` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ordre` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contenu` VARCHAR(191) NOT NULL,
    `statut` VARCHAR(191) NOT NULL DEFAULT 'ouvert',
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `question_faqRootId_idx` ON `question`(`faqRootId`);

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `chatroom` RENAME INDEX `Chatroom_idUser_fkey` TO `chatroom_idUser_idx`;

-- RenameIndex
ALTER TABLE `message` RENAME INDEX `Message_idChatroom_fkey` TO `message_idChatroom_idx`;

-- RenameIndex
ALTER TABLE `question` RENAME INDEX `question_parentId_fkey` TO `question_parentId_idx`;
