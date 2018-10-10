/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import makeTerable, {TAKE} from './Terable';

const take = count => iterable => makeTerable(TAKE, count, iterable);

export default take;
