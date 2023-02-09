import dotenv from 'dotenv';
dotenv.config();

import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { PrismaClient, Constellation } from '@prisma/client';

interface ApiMessierObjects {
	value: ApiMessierObject[]
}

interface ApiMessierObject {
	chart: string,
	common_name: string | '-',
	constellation: string,
	declination: string,
	distance: string,
	key: string,
	magnitude: string,
	ngc: string,
	picture_url: string,
	right_ascension: string,
	type: 'Supernova remnant' | 'Globular cluster' | 'Spiral galaxy' | 'Lenticular galaxy' | 'Open cluster' | 'Elliptical galaxy' | 'Barred Spiral galaxy' | 'Dwarf elliptical galaxy' | 'H II region nebula with cluster'
}

interface ApiMessierObjectWithConstellation extends ApiMessierObject {
	constellationRelation: Constellation
}

async function get<TResponse>(url: RequestInfo , config?: RequestInit): Promise<TResponse> {
	return <TResponse>fetch(url, config).then(result => result.json());
}

/**
 * Adds the messier objects and the list
 */
export const seed = async (prisma: PrismaClient) => {
	const objects = await get<ApiMessierObjects>('https://dkfd9t.deta.dev/v1/objects');

	const constellations = await prisma.constellation.findMany();

	const list = await prisma.astronomicalCatalogue.upsert({
		update: {
			name: 'Messier',
		},
		create: {
			name: 'Messier',
		},
		where: {
			name: 'Messier',
		}
	});

	const objectsWithConstellation = <ApiMessierObjectWithConstellation[]> objects.value.map(object => ({
		...object,
		constellationRelation: constellations.find(c => c.name === object.constellation)
	})).filter(o => typeof o.constellationRelation !== 'undefined');

	if (objects.value.length !== objectsWithConstellation.length) {
		throw new Error('Cannot match (all) messier api objects to existing constellations');
	}

	return Promise.all(objectsWithConstellation.map(object => prisma.astronomicalObject.create({
		data: {
			name: object.common_name !== '–' ? object.common_name : undefined,
			distance: Math.round(object.distance.replace('~', '').split('-').reduce((a, b) => a + parseFloat(b), 0) / object.distance.split('-').length * 1000),
			apparentMagnitude: parseFloat(object.magnitude),
			constellation: {
				connect: {
					id: object.constellationRelation.id,
				}
			},
			catalogueObject: {
				create: {
					catalogueNumber: parseInt(object.key.replace(/[^\d]/g, ''), 10),
					catalog: {
						connect: {
							id: list.id
						}
					}
				}
			}
		}
	})));
};