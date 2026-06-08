-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "character" TEXT,
ADD COLUMN     "compatibleCars" TEXT,
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "loadIndex" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "profile" TEXT,
ADD COLUMN     "rim" TEXT,
ADD COLUMN     "speedRating" TEXT,
ADD COLUMN     "stock" TEXT NOT NULL DEFAULT 'Ready',
ADD COLUMN     "vehicleType" TEXT,
ADD COLUMN     "warranty" TEXT,
ADD COLUMN     "width" TEXT,
ADD COLUMN     "yearProduction" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_rim_idx" ON "Product"("rim");
