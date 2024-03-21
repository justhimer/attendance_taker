/*
  Warnings:

  - You are about to drop the column `status` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `is_accepted` on the `Invitations` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AcceptanceStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "status",
ADD COLUMN     "attend_time" TIMESTAMPTZ,
ADD COLUMN     "late_reason" TEXT;

-- AlterTable
ALTER TABLE "Invitations" DROP COLUMN "is_accepted",
ADD COLUMN     "status" "AcceptanceStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "Status";
