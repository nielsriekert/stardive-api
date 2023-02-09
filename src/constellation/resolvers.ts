import { Context } from '../context.js';
import { Resolvers } from '../types/resolvers-types.js';

const resolvers: Resolvers = {
	Query: {
		constellation: (_, { id }, { prisma }: Context ) => {
			return prisma.constellation.findUniqueOrThrow({
				where: {
					id: parseInt(id, 10)
				},
			});
		},
		constellations: (_, __, { prisma }: Context ) => prisma.constellation.findMany(),
	},
	Constellation: {
		id: (Constellation) => Constellation.id.toString()
	}
};

export default resolvers;