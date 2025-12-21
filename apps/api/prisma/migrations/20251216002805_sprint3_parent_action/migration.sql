-- CreateEnum
CREATE TYPE "ParentIssueCategory" AS ENUM ('COMPLAINT', 'QUESTION', 'SUGGESTION', 'PRAISE', 'OTHER');

-- CreateEnum
CREATE TYPE "ParentIssueStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED_NO_ACTION');

-- CreateEnum
CREATE TYPE "ParentIssuePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "StudentActionPlanStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "StudentActionItemStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "ParentIssue" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "studentId" TEXT,
    "guardianId" TEXT,
    "category" "ParentIssueCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ParentIssueStatus" NOT NULL DEFAULT 'NEW',
    "priority" "ParentIssuePriority" NOT NULL DEFAULT 'MEDIUM',
    "assignedToUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "ParentIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentIssueComment" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentIssueComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentActionPlan" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "status" "StudentActionPlanStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentActionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentActionItem" (
    "id" TEXT NOT NULL,
    "actionPlanId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "StudentActionItemStatus" NOT NULL DEFAULT 'TODO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentActionItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ParentIssue_schoolId_idx" ON "ParentIssue"("schoolId");

-- CreateIndex
CREATE INDEX "ParentIssue_studentId_idx" ON "ParentIssue"("studentId");

-- CreateIndex
CREATE INDEX "ParentIssue_assignedToUserId_idx" ON "ParentIssue"("assignedToUserId");

-- CreateIndex
CREATE INDEX "ParentIssueComment_issueId_idx" ON "ParentIssueComment"("issueId");

-- CreateIndex
CREATE INDEX "ParentIssueComment_authorUserId_idx" ON "ParentIssueComment"("authorUserId");

-- CreateIndex
CREATE INDEX "StudentActionPlan_studentId_idx" ON "StudentActionPlan"("studentId");

-- CreateIndex
CREATE INDEX "StudentActionPlan_createdByUserId_idx" ON "StudentActionPlan"("createdByUserId");

-- CreateIndex
CREATE INDEX "StudentActionItem_actionPlanId_idx" ON "StudentActionItem"("actionPlanId");

-- CreateIndex
CREATE INDEX "StudentActionItem_ownerUserId_idx" ON "StudentActionItem"("ownerUserId");

-- AddForeignKey
ALTER TABLE "ParentIssue" ADD CONSTRAINT "ParentIssue_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentIssue" ADD CONSTRAINT "ParentIssue_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentIssue" ADD CONSTRAINT "ParentIssue_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentIssueComment" ADD CONSTRAINT "ParentIssueComment_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "ParentIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentIssueComment" ADD CONSTRAINT "ParentIssueComment_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActionPlan" ADD CONSTRAINT "StudentActionPlan_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActionPlan" ADD CONSTRAINT "StudentActionPlan_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActionItem" ADD CONSTRAINT "StudentActionItem_actionPlanId_fkey" FOREIGN KEY ("actionPlanId") REFERENCES "StudentActionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActionItem" ADD CONSTRAINT "StudentActionItem_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
