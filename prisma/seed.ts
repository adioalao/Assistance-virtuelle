import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  try {
       const user = await prisma.user.findUnique({
      where: { email: "alice.dupont@example.com" }
    });
          if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    console.log(`🔄 Utilisateur trouvé avec ID: ${user.id}`);

    const chatroom = await prisma.chatroom.create({
      data: {
        titre: "Discussion d'exemple",
        idUser: Number(user.id ),
        status: "actif"
      }
    });

    await prisma.message.create({
      data: {
        content: "Bonjour, ceci est un message de test.",
       // role: "user",
        idChatroom: chatroom.id
      }
    });

    console.log("Seed terminé avec succès !");
  } catch (error) {
    console.error("Erreur lors du seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();