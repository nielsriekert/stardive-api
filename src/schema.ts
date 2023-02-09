import { makeExecutableSchema } from '@graphql-tools/schema';

import { BigIntTypeDefinition, BigIntResolver } from 'graphql-scalars';
import typeDef from './typeDef.js';
import * as astronomicalObject from './astronomical-object/index.js';
import * as constellation from './constellation/index.js';
import * as user from './user/index.js';
import { authDirectiveTransformer } from './directives.js';

let schema = makeExecutableSchema({
	typeDefs: [
		BigIntTypeDefinition,
		typeDef,
		astronomicalObject.typeDef,
		constellation.typeDef,
		user.typeDef,
	],
	resolvers: [
		{ BigInt: BigIntResolver },
		astronomicalObject.resolvers,
		constellation.resolvers,
		user.resolvers,
	],
});

schema = authDirectiveTransformer(schema, 'auth');

export default schema;