/*
 * @flow
 * Copyright (c) 2018 Michael Wiencek
 *
 * This source code is licensed under the MIT license. A copy can be found
 * in the file named "LICENSE" at the root directory of this distribution.
 */

import type {AsyncIterableExt} from '../../types';

export default function boolFold<T>(truth: boolean): ((T) => mixed) => AsyncIterableExt<T> => Promise<boolean> {
  return function (test: (T) => mixed): AsyncIterableExt<T> => Promise<boolean> {
    return async function (iterable: AsyncIterableExt<T>): Promise<boolean> {
      for await (const value of iterable) {
        if (!!test(value) === truth) {
          return truth;
        }
      }
      return !truth;
    };
  };
};
