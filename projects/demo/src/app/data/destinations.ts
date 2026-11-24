export type Category = 'beaches' | 'cities' | 'mountains';

export interface Destination {
  slug: string;
  title: string;
  place: string;
  category: Category;
  /** Path under the app base href, e.g. `photos/kyoto.webp`. */
  photo: string;
  /** Photo width / height, so layout can cover-fit it without waiting for the file. */
  ratio: number;
  blurb: string;
  body: string[];
}

export const CATEGORIES: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'beaches', label: 'Beaches' },
  { id: 'cities', label: 'Cities' },
  { id: 'mountains', label: 'Mountains' },
];

export const DESTINATIONS: Destination[] = [
  {
    slug: 'navagio',
    title: 'Navagio',
    place: 'Zakynthos, Greece',
    category: 'beaches',
    photo: 'photos/navagio.webp',
    ratio: 0.667,
    blurb: 'A shipwreck on white sand, hidden between limestone cliffs.',
    body: [
      'Navagio is reachable only by boat. The water is so clear the hull looks like it floats on air.',
      'Go early. By noon the cove fills with tour boats, and the light that makes it famous is gone.',
    ],
  },
  {
    slug: 'bora-bora',
    title: 'Bora Bora',
    place: 'French Polynesia',
    category: 'beaches',
    photo: 'photos/bora-bora.webp',
    ratio: 1.52,
    blurb: 'A lagoon in every shade of blue, ringed by a sleeping volcano.',
    body: [
      'Rent a kayak and paddle the lagoon before breakfast. The reef is a few strokes from shore.',
      'Evenings belong to the overwater bungalows, where the only sound is water under the floor.',
    ],
  },
  {
    slug: 'kyoto',
    title: 'Kyoto',
    place: 'Kansai, Japan',
    category: 'cities',
    photo: 'photos/kyoto.webp',
    ratio: 0.667,
    blurb: 'Wooden lanes, lantern light and a temple around every corner.',
    body: [
      'Walk Gion at dusk, when the lanterns come on and the tourists thin out.',
      'Spring brings cherry blossom, autumn brings maples. Winter is quiet and nearly empty.',
    ],
  },
  {
    slug: 'lisbon',
    title: 'Lisbon',
    place: 'Portugal',
    category: 'cities',
    photo: 'photos/lisbon.webp',
    ratio: 1.499,
    blurb: 'Yellow trams, tiled facades and hills that earn every sunset.',
    body: [
      'Take tram 28 early, then get off and walk Alfama. The streets are the attraction.',
      'End the day at a miradouro with a glass of something cold and a view of the river.',
    ],
  },
  {
    slug: 'marrakech',
    title: 'Marrakech',
    place: 'Morocco',
    category: 'cities',
    photo: 'photos/marrakech.webp',
    ratio: 0.714,
    blurb: 'Rose-coloured walls, spice stalls and courtyards that hum with life.',
    body: [
      'Get lost in the souk on purpose. Every wrong turn ends at something worth buying.',
      'Retreat to a riad courtyard in the afternoon heat. Mint tea is not optional.',
    ],
  },
  {
    slug: 'dolomites',
    title: 'Dolomites',
    place: 'South Tyrol, Italy',
    category: 'mountains',
    photo: 'photos/dolomites.webp',
    ratio: 1.499,
    blurb: 'Pale spires that turn pink at dawn and gold at dusk.',
    body: [
      'Hut-to-hut hiking is the way to see them. Each refuge serves hot food and a bed.',
      'Chase the alpenglow. The peaks light up for about ten minutes, twice a day.',
    ],
  },
  {
    slug: 'patagonia',
    title: 'Patagonia',
    place: 'Torres del Paine, Chile',
    category: 'mountains',
    photo: 'photos/patagonia.webp',
    ratio: 1.499,
    blurb: 'Granite towers, turquoise lakes and wind that never stops.',
    body: [
      'The W trek takes four to five days and rewards every blister with a better view.',
      'Weather changes by the hour. Pack for all four seasons and accept it.',
    ],
  },
  {
    slug: 'lofoten',
    title: 'Lofoten',
    place: 'Nordland, Norway',
    category: 'mountains',
    photo: 'photos/lofoten.webp',
    ratio: 1.328,
    blurb: 'Red fishing cabins under jagged peaks, at the edge of the Arctic.',
    body: [
      'In winter the northern lights ride above the cabins. In summer the sun never sets.',
      'Stay in a rorbu, a converted fisherman cabin, and watch the sea from your bed.',
    ],
  },
];
