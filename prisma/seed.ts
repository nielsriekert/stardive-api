import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

import { seed as seedConstellations } from '../src/constellation/seed.js';
import { seed as seedMessierObjects } from '../src/astronomical-object/seed/messier.js';

async function main() {
	const niels = await prisma.user.upsert({
		where: { email: 'niels@riekert.nl' },
		update: {},
		create: {
			email: 'niels@riekert.nl',
			password: await bcrypt.hash('password', 10),
			name: 'Niels',
			emailVerified: new Date()
		},
	});

	const john = await prisma.user.upsert({
		where: { email: 'john@doe.io' },
		update: {},
		create: {
			email: 'john@doe.io',
			password: await bcrypt.hash('password', 10),
			name: 'John',
			emailVerified: new Date()
		},
	});

	const constellations = await seedConstellations(prisma);
	const messierObjects = await seedMessierObjects(prisma);

	console.log({ niels, john, constellations, messierObjectCount: messierObjects.length });
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
