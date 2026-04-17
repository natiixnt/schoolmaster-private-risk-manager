-- RODO Art. 32: dziennik audytowy operacji na danych osobowych
CREATE TABLE "AuditLog" (
    "id"         TEXT NOT NULL,
    "schoolId"   TEXT,
    "userId"     TEXT,
    "action"     TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId"   TEXT,
    "details"    JSONB,
    "ipAddress"  TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_schoolId_idx" ON "AuditLog"("schoolId");
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
