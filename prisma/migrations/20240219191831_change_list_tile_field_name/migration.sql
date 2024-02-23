/*
  Warnings:

  - You are about to drop the column `listTitle` on the `BookList` table. All the data in the column will be lost.
  - Added the required column `title` to the `BookList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookList" DROP COLUMN "listTitle",
ADD COLUMN     "title" TEXT NOT NULL;
