import { PrismaClient, User } from '@prisma/client';
import * as jose from 'jose';
import { DateTime } from 'luxon';
import crypto from 'crypto';

import { AuthPayload } from '../types/resolvers-types.js';

export const getAuthPayLoad = async (user: User): Promise<AuthPayload> => ({
	user
});

export const getSessionCookie = async (user: User, expired = false) : Promise<string> => {
	if (typeof process.env.AUTHORIZATION_TOKEN_SECRET !== 'string') {
		throw new ReferenceError('No AUTHORIZATION_TOKEN_SECRET set');
	}

	const expirationTime = DateTime.now().plus({
		hour: 720
	});

	const attributes : { [key: string]: string | null } = {
		Secure: null,
		SameSite: 'Strict',
		HttpOnly: null,
		Expires: !expired ?
			expirationTime.toHTTP() :
			DateTime.now().minus({ day: 1 }).toHTTP()
	};

	if (process.env.NODE_ENV === 'development') {
		delete attributes.Secure;
	}

	const value : string = !expired ?
		await new jose.SignJWT({ userId: user.id }).setProtectedHeader({
			alg: 'HS256',
			typ: 'JWT'
		}).setIssuedAt().setExpirationTime(
			expirationTime.toUnixInteger()
		).sign(
			crypto.createSecretKey(
				Buffer.from(process.env.AUTHORIZATION_TOKEN_SECRET)
			)
		) :
		'';

	return `StardiveApiSession=${value};${Object.keys(attributes).map(key => `${key}${attributes[key] ? `=${attributes[key]}` : ''};`).join('')}`;
};

const findSessionCookie = (cookies?: string) : string | null => {
	if (!cookies) {
		return null;
	}

	return cookies.split(';').find(cookie => cookie.trim().startsWith('StardiveApiSession=')) || null;
};

export const getUserFromCookies = async (prisma: PrismaClient, cookies?: string) : Promise<User | null> => {
	if (typeof process.env.AUTHORIZATION_TOKEN_SECRET !== 'string') {
		throw new ReferenceError('Cannot get user session cookie: environment variable AUTHORIZATION_TOKEN_SECRET is not set');
	}

	const cookie = findSessionCookie(cookies);

	if (!cookie) {
		return null;
	}

	const { payload: { userId } } = await jose.jwtVerify(cookie.split('=')[1], crypto.createSecretKey(Buffer.from(process.env.AUTHORIZATION_TOKEN_SECRET)));

	if (typeof userId !== 'number') {
		throw new ReferenceError('Cannot validate session cookie');
	}

	return prisma.user.findUniqueOrThrow({
		where: {
			id: userId
		}
	});
};