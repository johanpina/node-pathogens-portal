-- CreateEnum
CREATE TYPE "PathogenStatus" AS ENUM ('endemic', 'alert', 'monitoring', 'contained');

-- CreateEnum
CREATE TYPE "BundleStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BundleSource" AS ENUM ('MANUAL_IMPORT', 'AI_GENERATED');

-- CreateEnum
CREATE TYPE "NewsSeverity" AS ENUM ('high', 'medium', 'info');

-- CreateTable
CREATE TABLE "Pathogen" (
    "id" TEXT NOT NULL,
    "nameEs" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "status" "PathogenStatus" NOT NULL,
    "statusLabelEs" TEXT NOT NULL,
    "statusLabelEn" TEXT NOT NULL,
    "summaryEs" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "cardSources" TEXT[],
    "notesEs" TEXT,
    "notesEn" TEXT,
    "epiWeek" TEXT,
    "page" TEXT,
    "topicId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pathogen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathogenStat" (
    "id" TEXT NOT NULL,
    "pathogenId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "statId" TEXT,
    "value" TEXT NOT NULL,
    "labelEs" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,

    CONSTRAINT "PathogenStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathogenSource" (
    "id" TEXT NOT NULL,
    "pathogenId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "retrievedAt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PathogenSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpiMeta" (
    "id" TEXT NOT NULL DEFAULT 'current',
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "epiWeek" TEXT NOT NULL,
    "ew" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "homeAlertEs" TEXT NOT NULL,
    "homeAlertEn" TEXT NOT NULL,
    "regionalLastCheck" TEXT,
    "regionalSource" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EpiMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannerStat" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "value" TEXT NOT NULL,
    "labelEs" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,

    CONSTRAINT "BannerStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveillanceHighlight" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "metricValue" TEXT NOT NULL,
    "metricLabelEs" TEXT NOT NULL,
    "metricLabelEn" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "SurveillanceHighlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveillanceNews" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isoDate" TIMESTAMP(3) NOT NULL,
    "dateLabel" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "tags" TEXT[],
    "severity" "NewsSeverity" NOT NULL DEFAULT 'info',
    "summaryEs" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,

    CONSTRAINT "SurveillanceNews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathogenBundle" (
    "id" TEXT NOT NULL,
    "status" "BundleStatus" NOT NULL DEFAULT 'DRAFT',
    "source" "BundleSource" NOT NULL DEFAULT 'MANUAL_IMPORT',
    "epiWeek" TEXT,
    "rawMarkdown" TEXT,
    "parsedJson" JSONB NOT NULL,
    "validationErrors" JSONB,
    "createdById" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PathogenBundle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathogenChart" (
    "id" TEXT NOT NULL,
    "pathogenId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "kind" TEXT NOT NULL,
    "titleEs" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "narrativeEs" TEXT,
    "narrativeEn" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PathogenChart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pathogen" ADD CONSTRAINT "Pathogen_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathogenStat" ADD CONSTRAINT "PathogenStat_pathogenId_fkey" FOREIGN KEY ("pathogenId") REFERENCES "Pathogen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathogenSource" ADD CONSTRAINT "PathogenSource_pathogenId_fkey" FOREIGN KEY ("pathogenId") REFERENCES "Pathogen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathogenChart" ADD CONSTRAINT "PathogenChart_pathogenId_fkey" FOREIGN KEY ("pathogenId") REFERENCES "Pathogen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
