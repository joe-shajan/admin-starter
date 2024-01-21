// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient;
// }

// const client = globalThis.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

// export default client;

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
