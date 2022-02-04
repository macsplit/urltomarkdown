function padding(str, width, fillChar) {
  const padBytes = width - str.length;
  let padding = '';

  for (let i = 0; i < padBytes; ++i) {
    padding += fillChar;
  }

  return padding;
}

exports.ljust = function (str, width = 0, fillChar = ' ') {
  str = String(str);

  return str + padding(str, width, fillChar);
};

exports.rjust = function (str, width = 0, fillChar = ' ') {
  str = String(str);

  return padding(str, width, fillChar) + str;
};
