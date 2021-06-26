const request = require("request");

const geocode = (address, callback) => {
  // vì geocode sẽ chứa asynchronous function => sử dụng callback function.

  // encodeURIComponent giúp xử lý các kí tự đặc biệt
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(address) +
    ".json?access_token=pk.eyJ1Ijoia2hvYWxhdG9pZGF5IiwiYSI6ImNrcTdpczRlNDA2bGsycGwzOHFsdzV2MHgifQ.TxRMu_ommym6A8jd5O7E6g&limit=1";
  request({ url,json:true }, (error, {body}) => {
    if (error) {
      callback("Unable to connect to internet!", undefined);
    } else if (body.features.length === 0) {
      callback("Unable to find location! Please try again", undefined);
    } else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longtitude: body.features[0].center[0],
      });
    }
  });
};

module.exports = {
  geocode: geocode,
};
