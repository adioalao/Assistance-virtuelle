import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
  // Permet d'étendre l'objet global pour y inclure `prisma`
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
export { prisma };