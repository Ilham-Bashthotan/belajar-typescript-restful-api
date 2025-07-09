import { PrismaClient } from "@prisma/client";
import { logger } from "./logging";

export const prismaClient = new PrismaClient({
    log: [
        {
            emit: "event",
            level: "query",
        },
        {
            emit: "event",
            level: "error",
        },
        {
            emit: "event",
            level: "info",
        },
        {
            emit: "event",
            level: "warn",
        },
    ],
});

prismaClient.$on("error", (e) => {
    logger.error("Prisma Client Error:", e);
});

prismaClient.$on("warn", (e) => {
    logger.warn("Prisma Client Warning:", e);
});

prismaClient.$on("info", (e) => {
    logger.info("Prisma Client Info:", e);
});

prismaClient.$on("query", (e) => {
    logger.info("Prisma Client Query:", e);
});
