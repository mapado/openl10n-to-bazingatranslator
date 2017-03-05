'use strict';

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = (0, _minimist2.default)(process.argv.slice(2));

var requiredArgs = ['target', 'source', 'format'];

requiredArgs.forEach(function (arg) {
  if (typeof argv[arg] === 'undefined') {
    throw new Error('Missing argument ' + arg);
  }
});

var target = argv.target,
    source = argv.source,
    format = argv.format,
    _argv$encoding = argv.encoding,
    encoding = _argv$encoding === undefined ? 'utf-8' : _argv$encoding;


(0, _2.default)(target, source, format, encoding);