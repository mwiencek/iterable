/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {INTERSECTION} from './Terable';

const intersection = a => b => new Terable(INTERSECTION, {target: a, set: null}, b);

export default intersection;
