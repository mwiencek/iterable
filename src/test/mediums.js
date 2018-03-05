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
  +names:
    | Array<ArtistCreditName>
    | Array<Array<ArtistCreditName>>
    | Array<Array<Array<ArtistCreditName>>>,
|};

type Track = {|
  +artistCredit: ArtistCredit,
|};

type Medium = {|
  +tracks:
    | Array<Track>
    | Array<Array<Track>>,
|};

const artist1 = {id: 1};
const artist2 = {id: 2};
const artist3 = {id: 3};
const artist4 = {id: 4};
const artist5 = {id: 5};
const artist6 = {id: null};

const mediums: Array<Medium> = [
  {
    tracks: ([
      {
        artistCredit: {
          names: ([[
            {artist: artist1},
            {artist: artist2},
          ]]: Array<Array<ArtistCreditName>>),
        },
      },
      {
        artistCredit: {
          names: ([[[
            {artist: artist3},
            {artist: artist4},
          ]]]: Array<Array<Array<ArtistCreditName>>>),
        },
      },
      {
        artistCredit: {
          names: ([
            {artist: artist5},
            {artist: artist6},
            {artist: artist1},
          ]: Array<ArtistCreditName>),
        },
      },
    ]: Array<Track>),
  },
  {
    tracks: ([[
      {
        artistCredit: {
          names: ([
            {artist: artist2},
            {artist: artist3},
          ]: Array<ArtistCreditName>),
        },
      },
      {
        artistCredit: {
          names: ([
            {artist: artist4},
            {artist: artist5},
            {artist: artist6},
          ]: Array<ArtistCreditName>),
        },
      },
    ]]: Array<Array<Track>>),
  },
];

export default mediums;
