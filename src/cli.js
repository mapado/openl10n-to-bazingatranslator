import minimist from 'minimist';
import transformOpenl10n from './';

const argv = minimist(process.argv.slice(2));

const requiredArgs = [
  'target',
  'source',
  'format',
];

requiredArgs.forEach((arg) => {
  if (typeof argv[arg] === 'undefined') {
    throw new Error(`Missing argument ${arg}`);
  }
});

const { target, source, format, encoding = 'utf-8' } = argv;

transformOpenl10n(target, source, format, encoding);
