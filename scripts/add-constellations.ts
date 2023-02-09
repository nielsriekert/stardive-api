import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { seed } from '../src/constellation/seed.js';
const prisma = new PrismaClient();

async function main() {
	const constellations = await seed(prisma);

	console.log(constellations);
}

main()
	.catch(e => {
		console.error(e);
	}).finally(async () => {
		await prisma.$disconnect();
		process.exit(0);
	});