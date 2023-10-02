-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('NORMAL', 'PREMIUM');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS_TOKEN', 'REFRESH_TOKEN');

-- CreateTable
CREATE TABLE "Tokens" (
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "tokenPublicKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("userId","type")
);
