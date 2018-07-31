# smartcrop-jimp

This is an adapter module for using [smartcrop.js](https://github.com/jwagner/smartcrop.js)
with node.js using [jimp](https://github.com/oliver-moran/jimp) for image decoding.

## Installation

You'll need to install `jimp` alongside `smartcrop-jimp`.

```
npm install --save smartcrop-jimp jimp
```

## API

## crop(image, options)

**Image:** string (path to file) or buffer

**Options:** options object to be passed to smartcrop

**returns:** A promise for a cropResult

## Example

```javascript
var request = require('request');
var jimp = require('jimp');
var smartcrop = require('smartcrop-jimp');

function applySmartCrop(src, dest, width, height) {
  request(src, { encoding: null }, function process(error, response, body) {
    if (error) return console.error(error);
    smartcrop.crop(body, { width: width, height: height }).then(function(result) {
      var crop = result.topCrop;
      jimp(body)
        .extract({ width: crop.width, height: crop.height, left: crop.x, top: crop.y })
        .resize(width, height)
        .toFile(dest);
    });
  });
}

var src = 'https://raw.githubusercontent.com/jwagner/smartcrop-gm/master/test/flower.jpg';
applySmartCrop(src, 'flower-square.jpg', 128, 128);
```

## Face Detection Example

Check out [smartcrop-cli](https://github.com/jwagner/smartcrop-cli/) for a more advanced [example](https://github.com/jwagner/smartcrop-cli/blob/master/smartcrop-cli.js#L100) of how to use smartcrop from node including face detection with opencv.
