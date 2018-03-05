/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import filter from './filter';

type Falsy = false | null | void | 0 | '';

type CompactDef<T> = <T>(iterable: Iterable<T | Falsy>) => Iterable<T>;

const compact: CompactDef<mixed> = filter(Boolean);

export default compact;
