import { gql } from 'graphql-tag';

// NOTE: gql tag needed for codegen
export default gql`
	"Relay style pagination"
	interface Connection {
		edges: [Edge!]!
		pageInfo: PageInfo!
	}

	interface Edge {
		cursor: String!
	}

	interface PageInfo {
        hasNextPage: Boolean!
		hasPreviousPage: Boolean!
		startCursor: String
		endCursor: String
    }

	type Query

	type Mutation
`;