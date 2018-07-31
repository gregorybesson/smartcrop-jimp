const util = require('util');
const smartcrop = require('smartcrop');
const Jimp = require('jimp');
Jimp.prototype.getBufferAsync = util.promisify( Jimp.prototype.getBuffer );

function rgb2rgba(input) {
  var output = new Buffer(input.length / 3 * 4);
  for (var i = 0; i < input.length; i += 3) {
    output[i / 3 * 4] = input[i];
    output[i / 3 * 4 + 1] = input[i + 1];
    output[i / 3 * 4 + 2] = input[i + 2];
    output[i / 3 * 4 + 3] = 255;
  }
  return output;
}

var iop = {
  open: function(src) {
    return Jimp.read(src)
      .then(image => {
        return {
          width: image.bitmap.width,
          height: image.bitmap.height,
          _jimp: image
        };
      });
  },
  resample: function(image, width, height) {
    // this does not clone the image, better performance but fragile
    // (depends on the assumtion that resample+getData is only called once per img)
    return new Promise(function(resolve) {
      resolve({
        width: ~~width,
        height: ~~height,
        _jimp: image._jimp
      });
    });
  },
  getData: function(image) {
    return new Promise(function(resolve) {
      var options = { kernel: Jimp.RESIZE_BICUBIC };
      image._jimp.resize(image.width, image.height, options)
      var data = image._jimp.bitmap.data
      if (data.length === image.width * image.height * 3) {
        data = rgb2rgba(data);
      }
      if (data.length !== image.width * image.height * 4) {
        reject(new Error('unexpected data length ' + data.length));
      } else {
        resolve(new smartcrop.ImgData(image.width, image.height, data));
      }
    });
  }
};

exports.crop = function(img, options, callback) {
  options = options || {};
  options.imageOperations = iop;
  return smartcrop.crop(img, options, callback);
};
