/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {DIFFERENCE} from './Terable';

const difference = a => b => new Terable(DIFFERENCE, {target: a, set: null}, b);

export default difference;
