import { NextFunction, Response } from "express";
import { UserRequest } from "../type/user-request";
import { CreateContactRequest } from "../model/contact-model";
import { ContactService } from "../service/contact-service";

export class ContactController {
    static async create(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const request: CreateContactRequest =
                req.body as CreateContactRequest;
            const response = await ContactService.create(req.user!, request);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }

    static async get(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const contactId = Number(req.params.contactId);
            const response = await ContactService.get(req.user!, contactId);
            res.status(201).json({ data: response });
        } catch (e) {
            next(e);
        }
    }
}
