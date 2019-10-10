const request = require('request');
const fs = require('fs');

const url = process.env.DICTIONARY_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwmAFvs2FmTYZfaS6VMe3X0VbvuKCs5F94YbvcyRfD070GZ0eNvYZAZXoPuZyT4s6Wqho2wyVzeeeu/pub?gid=1987833874&single=true&output=tsv'

request(url, (err, res) => fs.writeFileSync('./dist/dictionary.csv', res.body));
