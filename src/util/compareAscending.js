/*
 * @flow
 *
 * This file contains source code from the Lodash project
 * (https://lodash.com/), with some trivial modifications to integrate it
 * with Terable.
 *
 * The original source code from which this file was based can be found
 * in the Lodash git repository at the following URLs:
 * https://github.com/lodash/lodash/blob/c7fee16/.internal/compareAscending.js
 * https://github.com/lodash/lodash/blob/c7fee16/isSymbol.js
 *
 * The copyright and license information for the original source code is
 * contained below.
 *
 * ====
 *
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 *
 * Based on Underscore.js, copyright Jeremy Ashkenas,
 * DocumentCloud and Investigative Reporters & Editors <http://underscorejs.org/>
 *
 * This software consists of voluntary contributions made by many
 * individuals. For exact contribution history, see the revision history
 * available at https://github.com/lodash/lodash
 *
 * The following license applies to all parts of this software except as
 * documented below:
 *
 * ====
 *
 * The MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * ====
 *
 * Copyright and related rights for sample code are waived via CC0. Sample
 * code is defined as all source code displayed within the prose of the
 * documentation.
 *
 * CC0: http://creativecommons.org/publicdomain/zero/1.0/
 *
 * ====
 *
 * Files located in the node_modules and vendor directories are externally
 * maintained libraries used by this software which have their own
 * licenses; we recommend you read them, as their terms may differ from the
 * terms above.
 */

const toString = Object.prototype.toString

function isSymbol(value) {
  const type = typeof value
  return type == 'symbol' || (type == 'object' && value != null && toString.call(value) == '[object Symbol]')
}

function compareAscending(value: any, other: any): -1 | 0 | 1 {
  if (value !== other) {
    const valIsDefined = value !== undefined
    const valIsNull = value === null
    const valIsReflexive = value === value
    const valIsSymbol = isSymbol(value)

    const othIsDefined = other !== undefined
    const othIsNull = other === null
    const othIsReflexive = other === other
    const othIsSymbol = isSymbol(other)

    const val: any = typeof value == 'string'
      ? value.localeCompare(other)
      : value > other

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && val > 0) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && val < 0) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1
    }
  }
  return 0
}

export default compareAscending
