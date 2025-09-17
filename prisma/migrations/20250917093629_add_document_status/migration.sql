-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ISSUED');

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT';
