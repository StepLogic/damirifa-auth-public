-- CreateTable
CREATE TABLE "EmailVerificationTable" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "sent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationTable_pkey" PRIMARY KEY ("id")
);
