import { GraphQLSchema, defaultFieldResolver, GraphQLError } from 'graphql';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';

const authDirectiveTransformer = (schema: GraphQLSchema, directiveName: string) => {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
			// Check whether this field has the specified directive
			const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

			if (authDirective) {
				// Get this field's original resolver
				const { resolve = defaultFieldResolver } = fieldConfig;

				fieldConfig.resolve = async function (source, args, context, info) {
					if (!context.loggedInUser) {
						throw new GraphQLError('You are not logged in', {
							extensions: {
								code: 'UNAUTHENTICATED',
							},
						});
					}

					return await resolve(source, args, context, info);
				};
				return fieldConfig;
			}
		}
	});
};

export {
	authDirectiveTransformer
};