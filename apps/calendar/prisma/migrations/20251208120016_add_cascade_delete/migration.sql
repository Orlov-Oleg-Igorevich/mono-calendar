-- DropForeignKey
ALTER TABLE "CategoryColor" DROP CONSTRAINT "CategoryColor_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "CategoryColor" ADD CONSTRAINT "CategoryColor_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
