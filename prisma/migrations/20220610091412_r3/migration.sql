/*
  Warnings:

  - You are about to drop the column `otp` on the `EmailVerificationTable` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `EmailVerificationTable` table. All the data in the column will be lost.
  - Added the required column `email` to the `EmailVerificationTable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `EmailVerificationTable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailVerificationTable" DROP COLUMN "otp",
DROP COLUMN "phone",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL;
