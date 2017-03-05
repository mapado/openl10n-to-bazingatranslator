'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readYml = readYml;

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fs = require('fs');

var _path = require('path');

var _bazingaFormatter = require('./bazingaFormatter');

var _bazingaFormatter2 = _interopRequireDefault(_bazingaFormatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function readYml(path) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'utf8';

  var translations = _jsYaml2.default.safeLoad((0, _fs.readFileSync)(path, format));

  var resourceFilename = path.replace(/^.*[\\/]/, '');
  var domain = resourceFilename.split('.')[0];
  var locale = resourceFilename.split('.')[1];

  return {
    domain: domain,
    locale: locale,
    translations: translations
  };
}

function transformFile(path, targetDirectory, targetFormat, encoding) {
  var _readYml = readYml(path, encoding),
      domain = _readYml.domain,
      locale = _readYml.locale,
      translations = _readYml.translations;

  var formattedTranslations = (0, _bazingaFormatter2.default)(translations, locale, domain, targetFormat);

  var targetFilePath = targetDirectory + '/' + domain + '/' + locale + '.' + targetFormat;
  return new Promise(function (resolve, reject) {
    (0, _mkdirp2.default)((0, _path.dirname)(targetFilePath), function (dirErr) {
      if (dirErr) {
        reject(dirErr);
      }

      (0, _fs.writeFile)(targetFilePath, formattedTranslations, encoding, function (fileErr) {
        if (fileErr) {
          reject(fileErr);
        }

        resolve(true);
      });
    });
  });
}

function listFilesInDirectory(path) {
  return new Promise(function (resolve, reject) {
    (0, _fs.readdir)(path, function (error, list) {
      if (error) {
        reject(error);
      }

      resolve(list);
    });
  });
}

function transformOpenl10n(targetDirectory, sourceDirectory) {
  var targetFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'json';
  var encoding = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'utf8';

  return listFilesInDirectory(sourceDirectory).then(function (listOfFiles) {
    return Promise.all(listOfFiles.map(function (file) {
      return transformFile(sourceDirectory + '/' + file, targetDirectory, targetFormat, encoding);
    }));
  });
}

exports.default = transformOpenl10n;