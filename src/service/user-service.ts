import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
    CreateUserRequest,
    LoginUserRequest,
    toUserResponse,
    UpdateUserRequest,
    UserResponse,
} from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bycript from "bcrypt";
import { v4 as uuid } from "uuid";

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

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request);

        let user = await prismaClient.user.findUnique({
            where: {
                username: loginRequest.username,
            },
        });

        if (!user) {
            throw new ResponseError(401, "Invalid username or password");
        }

        const isPasswordValid = await bycript.compare(
            loginRequest.password,
            user.password
        );
        if (!isPasswordValid) {
            throw new ResponseError(401, "Invalid username or password");
        }

        user = await prismaClient.user.update({
            where: {
                username: loginRequest.username,
            },
            data: {
                token: uuid(),
            },
        });

        const response: UserResponse = toUserResponse(user);
        response.token = user.token!;
        return response;
    }

    static async get(user: User): Promise<UserResponse> {
        return toUserResponse(user);
    }

    static async update(
        user: User,
        request: UpdateUserRequest
    ): Promise<UserResponse> {
        const updateRequest = Validation.validate(
            UserValidation.UPDATE,
            request
        );

        if (updateRequest.name) {
            updateRequest.name = updateRequest.name;
        }

        if (updateRequest.password) {
            updateRequest.password = await bycript.hash(
                updateRequest.password,
                10
            );
        }

        const result = await prismaClient.user.update({
            where: {
                username: user.username,
            },
            data: updateRequest,
        });

        return toUserResponse(result);
    }

    static async logout(user: User): Promise<UserResponse> {
        const result = await prismaClient.user.update({
            where: {
                username: user.username,
            },
            data: {
                token: null,
            },
        });

        return toUserResponse(result);
    }
}
