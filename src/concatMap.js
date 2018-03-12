/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {CONCATMAP} from './Terable';

const concatMap = func => iterable => new Terable(CONCATMAP, func, iterable);

export default concatMap;
