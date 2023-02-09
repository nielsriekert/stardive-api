import { gql } from 'graphql-tag';

// NOTE: gql tag needed for codegen
export default gql`
	type Constellation {
		id: ID
		name: String
	}

	type Query {
		constellation(id: ID!): Constellation!
		constellations: [Constellation!]!
	}
`;