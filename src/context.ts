import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getAuthPayLoad, getSessionCookie, getUserFromCookies } from './user/utils.js';
import { IncomingMessage, ServerResponse } from 'http';

export interface Context {
	req: IncomingMessage,
	res: ServerResponse,
	prisma: PrismaClient,
	loggedInUser: User | null,
	bcrypt: typeof bcrypt,
	getAuthPayLoad: typeof getAuthPayLoad,
	getSessionCookie: typeof getSessionCookie,
}

const prisma = new PrismaClient();

export const context = async ({ req, res } : { req: IncomingMessage, res: ServerResponse }) : Promise<Context> => ({
	req,
	res,
	prisma,
	loggedInUser: await getUserFromCookies(prisma, req.headers.cookie),
	bcrypt,
	getAuthPayLoad,
	getSessionCookie,
});