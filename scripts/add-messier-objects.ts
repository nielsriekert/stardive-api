import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { seed } from '../src/astronomical-object/seed/messier.js';

const prisma = new PrismaClient();

async function main() {
	const astronomicalObjects = await seed(prisma);

	console.log(astronomicalObjects);
}

main()
	.catch(e => {
		console.error(e);
	}).finally(async () => {
		await prisma.$disconnect();
		process.exit(0);
	});