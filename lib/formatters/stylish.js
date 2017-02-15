const path = require('path');
const chalk = require('chalk');
const table = require('text-table');

function pluralize(word, count) {
  return (count === 1 ? word : `${word}s`);
}

module.exports = (results) => {
  const total = results.length;
  const headers = [];
  let output = '';
  let prevfile;

  output += table(results.map((error, index) => {
    if (error.filename !== prevfile) {
      headers[index] = path.resolve(process.cwd(), error.filename);
    }
    prevfile = error.filename;

    return [
      '',
      error.line || 0,
      error.column || 0,
      chalk.red('error'),
      error.msg,
      chalk.dim(error.ruleId || error.code || ''),
    ];
  }), {
    align: ['', 'r', 'l'],
    stringLength(text) {
      return chalk.stripColor(text).length;
    },
  })
    .split('\n')
    .map(
      (item, index) => {
        const header = headers[index] ? chalk.underline(headers[index]) : null;
        const line = item.replace(
          /(\d+)\s+(\d+)/,
          (m, p1, p2) => chalk.dim(`${p1}:${p2}`)
        );

        return header ? `\n${header}\n${line}` : line;
      }
    )
    .join('\n');
  output += '\n\n';

  if (total > 0) {
    output += chalk.red.bold([
      '\u2716 ', total, pluralize(' problem', total),
      ' (', total, pluralize(' error', total), ')\n',
    ].join(''));
  }

  return total > 0 ? output : '';
};
