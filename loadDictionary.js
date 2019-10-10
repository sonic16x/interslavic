const request = require('request');
const fs = require('fs');

const url = process.env.DICTIONARY_URL;

console.log('URL', url);

request(url, (err, res) => {
  console.log('RESULT', err, res);
  fs.writeFileSync('./dist/dictionary.csv', res.body);
});