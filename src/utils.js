const stream = require('stream');

/**
 * transform - description
 *
 * @param  {type} trans description
 * @param  {type} flush     description
 * @return {type}           description
 */
function transform(trans, flush) {
  if (typeof flush === 'function') {
    return new stream.Transform({
      objectMode: true,
      transform: trans,
      flush,
    });
  }

  return new stream.Transform({
    objectMode: true,
    transform: trans,
  });
}

module.exports = {
  transform,
};
