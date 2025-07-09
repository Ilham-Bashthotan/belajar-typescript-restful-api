import { prismaClient } from "../src/application/database";

export class UserTset {
    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: "test",
            },
        });
    }
}
