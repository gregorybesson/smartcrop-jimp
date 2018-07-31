# smartcrop-jimp

This is an adapter module for using [smartcrop.js](https://github.com/jwagner/smartcrop.js)
with node.js using [jimp](https://github.com/oliver-moran/jimp) for image decoding.

The reason why I wanted to use Jimp with smartcrop.js is that jimp doesn't have no native dependency: It's 100% javascript. So mixing smartcrop and jimp seemed to me super natural to use with NodeJS.

This module is widely inspired by Jonas Weigner's https://github.com/jwagner/smartcrop-sharp
Thank you Jonas for smartcrop.js !

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
var Jimp = require('jimp');
var smartcrop = require('smartcrop-jimp');

function applySmartCrop(src, dest, width, height) {
  request(src, { encoding: null }, function process(error, response, body) {
    if (error) return console.error(error);
    smartcrop.crop(body, { width: width, height: height }).then(function(result) {
      var crop = result.topCrop;
      Jimp(body)
        .crop(crop.x, crop.y, crop.width, crop.height)
        .resize(width, height)
        .write(dest);
    });
  });
}

var src = 'https://raw.githubusercontent.com/jwagner/smartcrop-gm/master/test/flower.jpg';
applySmartCrop(src, 'flower-square.jpg', 128, 128);
```

## Face Detection Example

Check out [smartcrop-cli](https://github.com/jwagner/smartcrop-cli/) for a more advanced [example](https://github.com/jwagner/smartcrop-cli/blob/master/smartcrop-cli.js#L100) of how to use smartcrop from node including face detection with opencv.
