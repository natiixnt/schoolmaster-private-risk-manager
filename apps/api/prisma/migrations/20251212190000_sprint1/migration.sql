-- Create new enum to replace StudentStatus (dropping INACTIVE) and map old values
CREATE TYPE "StudentStatus_new" AS ENUM ('ACTIVE', 'GRADUATED', 'LEFT');

ALTER TABLE "Student" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Student"
ALTER COLUMN "status" TYPE "StudentStatus_new" USING (
  CASE
    WHEN "status"::text = 'INACTIVE' THEN 'LEFT'
    ELSE "status"::text
  END::"StudentStatus_new"
);

ALTER TYPE "StudentStatus" RENAME TO "StudentStatus_old";
ALTER TYPE "StudentStatus_new" RENAME TO "StudentStatus";

ALTER TABLE "Student" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

DROP TYPE "StudentStatus_old";

-- Ensure existing schools have a non-null type before enforcing NOT NULL
UPDATE "School" SET "type" = 'UNSPECIFIED' WHERE "type" IS NULL;
ALTER TABLE "School" ALTER COLUMN "type" SET NOT NULL;
