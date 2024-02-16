-- CreateTable
CREATE TABLE "Book" (
    "isbn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "publisher" TEXT NOT NULL,
    "genres" TEXT[],

    CONSTRAINT "Book_pkey" PRIMARY KEY ("isbn")
);
