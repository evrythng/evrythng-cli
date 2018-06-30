module.exports = (msg, level, multiplier = 1) => `${' '.repeat(level * multiplier)}${msg}`;
