/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import filter from './filter';

type Falsy = false | null | void | 0 | '';

const compact = filter<Falsy, *>(Boolean);

export default compact;
