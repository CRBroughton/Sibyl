import { assert, describe, expect, test } from 'vitest'
import { Sibyl } from '../index'

describe('convertToObjects Tests', () => {
    test('Converts the raw DB data into the correct shape', async() => {
        const mockData = {
            "columns": [
              "id",
              "name",
              "sex",
              "job"
            ],
            "values": [
              [
                6677037408321536,
                "Alejandrin",
                "male",
                "Central Security Designer"
              ],
              [
                927907004284928,
                "Fiona",
                "male",
                "International Usability Associate"
              ],
              [
                1564030560894976,
                "Yasmin",
                "male",
                "Central Quality Assistant"
              ],
              [
                5219980614303744,
                "Tobin",
                "male",
                "Customer Usability Strategist"
              ],
              [
                8578073427443712,
                "Theresia",
                "male",
                "Principal Brand Administrator"
              ],
              [
                5066780668067840,
                "Brooks",
                "male",
                "Central Quality Executive"
              ],
              [
                8632685001965568,
                "Sammie",
                "male",
                "Lead Operations Technician"
              ],
              [
                3481955305783296,
                "Waldo",
                "male",
                "Central Research Coordinator"
              ],
              [
                129470891556864,
                "Tanya",
                "male",
                "Direct Usability Administrator"
              ],
              [
                2092943076753408,
                "Aletha",
                "male",
                "Forward Interactions Director"
              ],
              [
                3136150640263168,
                "Sadye",
                "male",
                "Customer Identity Consultant"
              ],
              [
                1856537620381696,
                "Ezekiel",
                "male",
                "Lead Interactions Officer"
              ],
              [
                6233615807545344,
                "Kade",
                "male",
                "Regional Tactics Supervisor"
              ],
              [
                5782787944611840,
                "Louie",
                "male",
                "District Interactions Consultant"
              ],
              [
                6556661296660480,
                "Nicklaus",
                "male",
                "District Brand Technician"
              ],
              [
                2180446741856256,
                "Ava",
                "male",
                "Central Identity Planner"
              ],
              [
                3019715660218368,
                "Amaya",
                "male",
                "Senior Usability Specialist"
              ],
              [
                8937952516243456,
                "Austyn",
                "male",
                "National Solutions Designer"
              ],
              [
                5645304416174080,
                "Lukas",
                "male",
                "Legacy Creative Officer"
              ],
              [
                7871957672394752,
                "Khalid",
                "male",
                "Human Tactics Technician"
              ]
            ]
        }

        const { convertToObjects } = await Sibyl('testing-DB', 'playground/public/sql-wasm.wasm')

        const actual = convertToObjects(mockData)
        const expectation = [
            {
              id: 6677037408321536,
              name: 'Alejandrin',
              sex: 'male',
              job: 'Central Security Designer'
            },
            {
              id: 927907004284928,
              name: 'Fiona',
              sex: 'male',
              job: 'International Usability Associate'
            },
            {
              id: 1564030560894976,
              name: 'Yasmin',
              sex: 'male',
              job: 'Central Quality Assistant'
            },
            {
              id: 5219980614303744,
              name: 'Tobin',
              sex: 'male',
              job: 'Customer Usability Strategist'
            },
            {
              id: 8578073427443712,
              name: 'Theresia',
              sex: 'male',
              job: 'Principal Brand Administrator'
            },
            {
              id: 5066780668067840,
              name: 'Brooks',
              sex: 'male',
              job: 'Central Quality Executive'
            },
            {
              id: 8632685001965568,
              name: 'Sammie',
              sex: 'male',
              job: 'Lead Operations Technician'
            },
            {
              id: 3481955305783296,
              name: 'Waldo',
              sex: 'male',
              job: 'Central Research Coordinator'
            },
            {
              id: 129470891556864,
              name: 'Tanya',
              sex: 'male',
              job: 'Direct Usability Administrator'
            },
            {
              id: 2092943076753408,
              name: 'Aletha',
              sex: 'male',
              job: 'Forward Interactions Director'
            },
            {
              id: 3136150640263168,
              name: 'Sadye',
              sex: 'male',
              job: 'Customer Identity Consultant'
            },
            {
              id: 1856537620381696,
              name: 'Ezekiel',
              sex: 'male',
              job: 'Lead Interactions Officer'
            },
            {
              id: 6233615807545344,
              name: 'Kade',
              sex: 'male',
              job: 'Regional Tactics Supervisor'
            },
            {
              id: 5782787944611840,
              name: 'Louie',
              sex: 'male',
              job: 'District Interactions Consultant'
            },
            {
              id: 6556661296660480,
              name: 'Nicklaus',
              sex: 'male',
              job: 'District Brand Technician'
            },
            {
              id: 2180446741856256,
              name: 'Ava',
              sex: 'male',
              job: 'Central Identity Planner'
            },
            {
              id: 3019715660218368,
              name: 'Amaya',
              sex: 'male',
              job: 'Senior Usability Specialist'
            },
            {
              id: 8937952516243456,
              name: 'Austyn',
              sex: 'male',
              job: 'National Solutions Designer'
            },
            {
              id: 5645304416174080,
              name: 'Lukas',
              sex: 'male',
              job: 'Legacy Creative Officer'
            },
            {
              id: 7871957672394752,
              name: 'Khalid',
              sex: 'male',
              job: 'Human Tactics Technician'
            }
        ]

        expect(actual).toStrictEqual(expectation)
    })
})

