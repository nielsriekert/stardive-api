import { Context } from '../context.js';
import { Resolvers } from '../types/resolvers-types.js';

import { Prisma, AstronomicalObject } from '@prisma/client';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';

const resolvers: Resolvers = {
	Query: {
		astronomicalObject: async (_, { id }, { prisma }: Context ) => {
			return await prisma.astronomicalObject.findUniqueOrThrow({
				where: {
					id: parseInt(id, 10)
				},
			});
		},
		astronomicalObjects: async (_, { first, last, after, before }, { prisma }: Context ) => {
			return await findManyCursorConnection<AstronomicalObject, Pick<Prisma.UserWhereUniqueInput, 'id'>>(
				(args) => prisma.astronomicalObject.findMany(args),
				() => prisma.astronomicalObject.count(),
				after ? { first, after } : before ? { last, before } : { first },
			);
		},
	},
	AstronomicalObject: {
		id: (AstronomicalObject) => AstronomicalObject.id.toString()
	}
};

export default resolvers;