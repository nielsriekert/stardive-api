import dotenv from 'dotenv';
dotenv.config();

import 'json-bigint-patch';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { context } from './context.js';
import schema from './schema.js';

const server = new ApolloServer({
	schema
});

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
	context
});

console.log(`🚀  Server ready at: ${url}`);