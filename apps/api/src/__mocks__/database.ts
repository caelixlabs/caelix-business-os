// apps/api/src/__mocks__/database.ts
export const prisma = {};
export const PrismaClient = jest.fn().mockImplementation(() => ({
  $connect: jest.fn(),
  $disconnect: jest.fn(),
}));