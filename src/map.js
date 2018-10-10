/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import makeTerable, {MAP} from './Terable';

const map = func => iterable => makeTerable(MAP, func, iterable);

export default map;
