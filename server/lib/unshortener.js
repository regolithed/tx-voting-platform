const unshortener = require('unshortener');

module.exports = {
  // module.exports = {
  expand: function unexpand() {
      // url is a url object
    // return new Promise((resolve) => {
      const args = arguments;
      const shortened = unshortener.expand.apply(null, args);
      // console.log('--------------urlllllllllllll', url);
      console.log('in unshorten.js----------->>>', args);
      return shortened;
      // return resolve(shortened)
    // });
  },
};
  // expand: function expand(
  // const args = arguments;
  // const shortened = unshortener.expand.apply(null, args);
  //    url,
  //   (err, urls) => {
  //     // url is a url object
  //     console.log('--------------urlllllllllllll', urls);
  //     console.log('--------------err', err);
  //   })
  // ) {
  //   console.log('-------------------------->>>>>', shortened)
  //   return shortened;
    // .then(response =>
    //   // response.json())
    //   console.log('response---------------------------', response),
    // );

// };
