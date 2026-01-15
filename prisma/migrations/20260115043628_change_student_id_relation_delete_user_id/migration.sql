/*
  Warnings:

  - You are about to drop the column `userId` on the `AssignmentSubmission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssignmentSubmission" DROP CONSTRAINT "AssignmentSubmission_userId_fkey";

-- AlterTable
ALTER TABLE "AssignmentSubmission" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
