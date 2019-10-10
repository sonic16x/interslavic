const request = require('request');
const fs = require('fs');

const url = process.env.DICTIONARY_URL;

request(url, (err, res) => fs.writeFileSync('./dist/dictionary.csv', res.body));