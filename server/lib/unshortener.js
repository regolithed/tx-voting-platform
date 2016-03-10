const unshortener = require('unshortener');

module.exports = {
  expand: function expand() {
    const args = arguments;
    const shortened = unshortener.expand.apply(null, args);
    console.log('----------===========', shortened);
    return shortened;
  },
};
