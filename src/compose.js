/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

const cache = Object.create(null);

const compose: $Compose = ((...funcs) => {
  const count = funcs.length;
  let _compose = cache[count];
  if (!_compose) {
    const args = [];
    let body = 'v';
    for (let i = 0; i < count; i++) {
      args.push('f' + String(count - i - 1));
      body = 'f' + String(i) + '(' + body + ')';
    }
    body = 'return function(v){return ' + body + '}';
    args.push(body);
    cache[count] = (_compose = new Function(...(args: any)));
  }
  return _compose(...funcs);
}: any);

export default compose;
