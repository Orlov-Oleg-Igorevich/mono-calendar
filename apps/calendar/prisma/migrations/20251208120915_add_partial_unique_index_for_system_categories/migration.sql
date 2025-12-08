-- DropIndex
DROP INDEX IF EXISTS "Category_userId_name_key";

-- Create partial unique indexes
CREATE UNIQUE INDEX "Category_userId_name_key" 
  ON "Category"("userId", "name") 
  WHERE "userId" IS NOT NULL;

CREATE UNIQUE INDEX "Category_name_system_key" 
  ON "Category"("name") 
  WHERE "userId" IS NULL;