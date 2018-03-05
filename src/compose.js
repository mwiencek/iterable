/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const compose2 = (a, b) => value => a(b(value));

const compose = ((((...funcs) => funcs.reduce(compose2)): any): $Compose);

export default compose;
