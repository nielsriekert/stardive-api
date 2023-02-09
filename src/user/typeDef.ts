import { gql } from 'graphql-tag';

// NOTE: gql tag needed for codegen
export default gql`
	directive @auth on FIELD_DEFINITION

	type User {
		email: String!
		name: String
	}

	type AuthPayload {
		user: User!
	}

	extend type Query {
		me: User @auth
	}

	extend type Mutation {
		login(email: String! password: String!): AuthPayload
	}
`;