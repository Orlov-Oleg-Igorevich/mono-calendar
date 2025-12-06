-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskCategory" (
    "taskId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TaskCategory_pkey" PRIMARY KEY ("taskId","categoryId")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryColor" (
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "CategoryColor_pkey" PRIMARY KEY ("userId","categoryId")
);

-- CreateTable
CREATE TABLE "CalendarView" (
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isShared" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "color" TEXT,
    "category1Id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarView_pkey" PRIMARY KEY ("userId","taskId")
);

-- CreateTable
CREATE TABLE "UserCash" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCash_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskShare" (
    "sharedWithUserId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'read',

    CONSTRAINT "TaskShare_pkey" PRIMARY KEY ("sharedWithUserId","taskId")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Task_authorId_startDate_idx" ON "Task"("authorId", "startDate");

-- CreateIndex
CREATE INDEX "Category_isSystem_idx" ON "Category"("isSystem");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_name_key" ON "Category"("userId", "name");

-- CreateIndex
CREATE INDEX "CategoryColor_userId_idx" ON "CategoryColor"("userId");

-- CreateIndex
CREATE INDEX "CalendarView_userId_startDate_idx" ON "CalendarView"("userId", "startDate");

-- CreateIndex
CREATE UNIQUE INDEX "UserCash_email_key" ON "UserCash"("email");

-- CreateIndex
CREATE INDEX "OutboxEvent_processed_createdAt_idx" ON "OutboxEvent"("processed", "createdAt");

-- AddForeignKey
ALTER TABLE "TaskCategory" ADD CONSTRAINT "TaskCategory_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCategory" ADD CONSTRAINT "TaskCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryColor" ADD CONSTRAINT "CategoryColor_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskShare" ADD CONSTRAINT "TaskShare_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
