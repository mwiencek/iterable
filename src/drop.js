/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import makeTerable, {DROP} from './Terable';

const drop = count => iterable => makeTerable(DROP, count, iterable);

export default drop;
