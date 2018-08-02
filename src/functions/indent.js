/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

module.exports = (msg, level, multiplier = 1) => `${' '.repeat(level * multiplier)}${msg}`;
