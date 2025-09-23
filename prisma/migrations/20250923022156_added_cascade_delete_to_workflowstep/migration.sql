-- DropForeignKey
ALTER TABLE "workflow_steps" DROP CONSTRAINT "workflow_steps_document_id_fkey";

-- AddForeignKey
ALTER TABLE "workflow_steps" ADD CONSTRAINT "workflow_steps_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
