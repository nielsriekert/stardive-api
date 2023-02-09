import { gql } from 'graphql-tag';

export default gql`
	type AstronomicalObjectConnection implements Connection {
		totalCount: Int!
		edges: [AstronomicalObjectEdge!]!
		pageInfo: AstronomicalObjectPageInfo!
	}

	type AstronomicalObjectEdge implements Edge {
		cursor: String!
		node: AstronomicalObject!
	}

	type AstronomicalObjectPageInfo implements PageInfo {
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
		startCursor: String
		endCursor: String
	}

	type AstronomicalObject {
		id: ID!
		name: String
		distance: BigInt
		apparentMagnitude: Float
	}

	type Query {
		astronomicalObject(id: ID!): AstronomicalObject!
		astronomicalObjects(
			"The number of results to show. Must be >= 1. Default = 40."
			first: Int
			"The number of results to show. Must be >= 1. Default = 40."
			last: Int
			"If you add a cursor here, it will only return results _after_ this cursor."
			after: String
			"If you add a cursor here, it will only return results _before_ this cursor."
			before: String
		): AstronomicalObjectConnection!
	}
`;