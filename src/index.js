import yaml from 'js-yaml';
import mkdirp from 'mkdirp';
import { readdir, readFileSync, writeFile } from 'fs';
import { dirname } from 'path';
import formatTranslationList from './bazingaFormatter';

export function readYml(path, format = 'utf8') {
  const translations = yaml.safeLoad(readFileSync(path, format));

  const resourceFilename = path.replace(/^.*[\\/]/, '');
  const domain = resourceFilename.split('.')[0];
  const locale = resourceFilename.split('.')[1];

  return {
    domain,
    locale,
    translations,
  };
}

function transformFile(path, targetDirectory, targetFormat, encoding) {
  const { domain, locale, translations } = readYml(path, encoding);
  const formattedTranslations = formatTranslationList(translations, locale, domain, targetFormat);

  const targetFilePath = `${targetDirectory}/${domain}/${locale}.${targetFormat}`;
  return new Promise((resolve, reject) => {
    mkdirp(dirname(targetFilePath), (dirErr) => {
      if (dirErr) {
        reject(dirErr);
      }

      writeFile(targetFilePath, formattedTranslations, encoding, (fileErr) => {
        if (fileErr) {
          reject(fileErr);
        }

        resolve(true);
      });
    });
  });
}

function listFilesInDirectory(path) {
  return new Promise((resolve, reject) => {
    readdir(path, (error, list) => {
      if (error) {
        reject(error);
      }

      resolve(list);
    });
  });
}

function transformOpenl10n(targetDirectory, sourceDirectory, targetFormat = 'json', encoding = 'utf8') {
  return listFilesInDirectory(sourceDirectory)
  .then(listOfFiles => Promise.all(
    listOfFiles.map(
      file => transformFile(`${sourceDirectory}/${file}`, targetDirectory, targetFormat, encoding),
    ),
  ))
  ;
}

export default transformOpenl10n;
