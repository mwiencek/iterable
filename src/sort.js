/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import sortBy from './sortBy';

const identity = <T>(x: T): T => x;

const sort = sortBy(identity);

export default sort;
