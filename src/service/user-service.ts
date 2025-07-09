import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
    CreateUserRequest,
    toUserResponse,
    UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bycript from "bcrypt";

export class UserService {
    static async createUser(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(
            UserValidation.REGISTER,
            request
        );

        const totalUserWithUsername = await prismaClient.user.count({
            where: {
                username: registerRequest.username,
            },
        });

        if (totalUserWithUsername != 0) {
            throw new ResponseError(400, "Username already exists");
        }

        registerRequest.password = await bycript.hash(
            registerRequest.password,
            10
        );

        const user = await prismaClient.user.create({
            data: registerRequest,
        });

        return toUserResponse(user);
    }
}
