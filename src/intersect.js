/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {INTERSECT} from './Terable';

const intersect = a => b => new Terable(INTERSECT, {target: a, set: null}, b);

export default intersect;
