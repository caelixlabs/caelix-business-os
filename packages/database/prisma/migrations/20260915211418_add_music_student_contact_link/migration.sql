-- AlterTable
ALTER TABLE "public"."MusicStudent" ADD COLUMN "contactId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MusicStudent_contactId_key" ON "public"."MusicStudent"("contactId");

-- AddForeignKey
ALTER TABLE "public"."MusicStudent" ADD CONSTRAINT "MusicStudent_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
