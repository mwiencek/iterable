/*
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import Terable, {CONCAT} from './Terable';

const concat = iterable => new Terable(CONCAT, null, iterable);

export default concat;