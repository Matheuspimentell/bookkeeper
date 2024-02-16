/*
  Warnings:

  - Added the required column `pub_year` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "pub_year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "BookList" ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ListEntry" (
    "id" SERIAL NOT NULL,
    "score" INTEGER,
    "review" TEXT,
    "bookIsbn" TEXT NOT NULL,
    "bookListId" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListEntry" ADD CONSTRAINT "ListEntry_bookListId_fkey" FOREIGN KEY ("bookListId") REFERENCES "BookList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
