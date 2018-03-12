/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

type Artist = {|
  +id: number | null,
|};

type ArtistCreditName = {|
  +artist: Artist,
|};

type ArtistCredit = {|
  +names: Array<ArtistCreditName>,
|};

type Track = {|
  +artistCredit: ArtistCredit,
|};

type Medium = {|
  +tracks: Array<Track>,
|};

const artist1 = {id: 1};
const artist2 = {id: 2};
const artist3 = {id: 3};
const artist4 = {id: 4};
const artist5 = {id: 5};
const artist6 = {id: null};

const mediums: Array<Medium> = [
  {
    tracks: [
      {
        artistCredit: {
          names: [
            {artist: artist1},
            {artist: artist2},
          ],
        },
      },
      {
        artistCredit: {
          names: [
            {artist: artist3},
            {artist: artist4},
          ],
        },
      },
      {
        artistCredit: {
          names: [
            {artist: artist5},
            {artist: artist6},
            {artist: artist1},
          ],
        },
      },
    ],
  },
  {
    tracks: [
      {
        artistCredit: {
          names: [
            {artist: artist2},
            {artist: artist3},
          ],
        },
      },
      {
        artistCredit: {
          names: [
            {artist: artist4},
            {artist: artist5},
            {artist: artist6},
          ],
        },
      },
    ],
  },
];

export default mediums;
