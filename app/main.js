'use strict';

const request = require('request');
const { writeFile } = require('fs');

const TOKEN     = '';  // Access Token
const GROUPS    = [];  // Groups
const API_URL   = ``;  // URL 'http://xxxxx.xxx'
const DEST_URL  = 'dest-url';
const DEST_NAME = 'dest-name';

const run = (group) => {
  (async () => {
    const _data = await new Promise((resolve) => {
      request.get({
        uri: `${ API_URL }/api/v3/groups/${ group }/projects`,
        headers: { 'Content-type': 'application/json' },
        qs: {
          private_token: TOKEN,
          per_page     : 100,
        },
        json: true,
      }, (err, req, data) => {
        if(err) err();
        resolve(data);
      });
    });

    const _sshUrls = _data.map((d) => {
      return d.ssh_url_to_repo;
    });
    const _nameStr = _data.reduce((memo, d) => {
      memo += `${ group }--${ d.name }\n`;
      return memo;
    }, '');

    writeFile(`${ DEST_URL }/${ group }.txt`, JSON.stringify(_sshUrls));
    writeFile(`${ DEST_NAME }/${ group }.txt`, _nameStr);
  })();
};

for (const group of GROUPS) {
  run(group);
}
