import { GraphQLError } from 'graphql';
import { Resolvers } from '../types/resolvers-types.js';

const resolvers: Resolvers = {
	Query: {
		me: async (_, __, { loggedInUser }) => loggedInUser
	},
	Mutation: {
		login: async (
			_,
			{ email, password },
			{ prisma, bcrypt, res, getAuthPayLoad, getSessionCookie },
		) => {
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					// TODO: toLowerCase as directive
					email: email.toLowerCase(),
				},
			});

			if(!user.password || !user.emailVerified) {
				throw new GraphQLError(
					'Je e-mailadres is nog niet geverifeerd, check je e-mail ',
					{
						extensions: {
							code: 'BAD_USER_INPUT',
						},
					},
				);
			}

			if (!user || !(await bcrypt.compare(password, user.password))) {
				throw new GraphQLError(
					'Ongeldige combinatie van e-mailadres en wachtwoord',
					{
						extensions: {
							code: 'BAD_USER_INPUT',
						},
					},
				);
			}

			res.setHeader('Set-Cookie', await getSessionCookie(user));

			return getAuthPayLoad(user);
		}
	},
};

export default resolvers;
