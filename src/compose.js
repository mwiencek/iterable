/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

// Avoiding $Compose due to https://github.com/facebook/flow/issues/5932
type _Compose1 = <A, V>(
  a: (V) => A,
) => ((V) => A);

type _Compose2 = <A, B, V>(
  a: (B) => A,
  b: (V) => B,
) => ((V) => A);

type _Compose3 = <A, B, C, V>(
  a: (B) => A,
  b: (C) => B,
  c: (V) => C,
) => ((V) => A);

type _Compose4 = <A, B, C, D, V>(
  a: (B) => A,
  b: (C) => B,
  c: (D) => C,
  d: (V) => D,
) => ((V) => A);

type _Compose5 = <A, B, C, D, E, V>(
  a: (B) => A,
  b: (C) => B,
  c: (D) => C,
  d: (E) => D,
  e: (V) => E,
) => ((V) => A);

type _Compose6 = <A, B, C, D, E, F, V>(
  a: (B) => A,
  b: (C) => B,
  c: (D) => C,
  d: (E) => D,
  e: (F) => E,
  f: (V) => F,
) => ((V) => A);

type _Compose7 = <A, B, C, D, E, F, G, V>(
  a: (B) => A,
  b: (C) => B,
  c: (D) => C,
  d: (E) => D,
  e: (F) => E,
  f: (G) => F,
  g: (V) => G,
) => ((V) => A);

type _Compose8 = <A, B, C, D, E, F, G, H, V>(
  a: (B) => A,
  b: (C) => B,
  c: (D) => C,
  d: (E) => D,
  e: (F) => E,
  f: (G) => F,
  g: (H) => G,
  h: (V) => H,
) => ((V) => A);

type _Compose9 = <A, B, C, D, E, F, G, H, I, V>(
  a: (B) => A,
  b: (C) => B,
  c: (D) => C,
  d: (E) => D,
  e: (F) => E,
  f: (G) => F,
  g: (H) => G,
  h: (I) => H,
  i: (V) => I,
) => ((V) => A);

type _Compose10 = <A, B, C, D, E, F, G, H, I, J, V>(
  a: (B) => A,
  b: (C) => B,
  c: (D) => C,
  d: (E) => D,
  e: (F) => E,
  f: (G) => F,
  g: (H) => G,
  h: (I) => H,
  i: (J) => I,
  j: (V) => J,
) => ((V) => A);

type _Compose11 = <A, B, C, D, E, F, G, H, I, J, K, V>(
  a: (B) => A,
  b: (C) => B,
  c: (D) => C,
  d: (E) => D,
  e: (F) => E,
  f: (G) => F,
  g: (H) => G,
  h: (I) => H,
  i: (J) => I,
  j: (K) => J,
  k: (V) => K,
) => ((V) => A);

type _Compose12 = <A, B, C, D, E, F, G, H, I, J, K, L, V>(
  a: (B) => A,
  b: (C) => B,
  c: (D) => C,
  d: (E) => D,
  e: (F) => E,
  f: (G) => F,
  g: (H) => G,
  h: (I) => H,
  i: (J) => I,
  j: (K) => J,
  k: (L) => K,
  l: (V) => L,
) => ((V) => A);

type _Compose =
  & _Compose1
  & _Compose2
  & _Compose3
  & _Compose4
  & _Compose5
  & _Compose6
  & _Compose7
  & _Compose8
  & _Compose9
  & _Compose10
  & _Compose11
  & _Compose12;

const cache = Object.create(null);

const compose = (((...funcs) => {
  const count = funcs.length;
  let _compose = cache[count];
  if (!_compose) {
    const args: any = [];
    let body = 'v';
    for (let i = 0; i < count; i++) {
      args.push('f' + String(count - i - 1));
      body = 'f' + String(i) + '(' + body + ')';
    }
    body = 'return function(v){return ' + body + '}';
    args.push(body);
    cache[count] = (_compose = new Function(...args));
  }
  return _compose(...funcs);
}: any): _Compose);

export default compose;
