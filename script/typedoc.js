// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const { exec } = require('child_process');

async function Typedoc() {
  let dir = path.join(process.cwd(), 'tgsnake');
  if (!fs.existsSync(dir)) {
    console.log('cloning repository');
    await git.clone({
      fs,
      http,
      dir,
      url: 'https://github.com/tgsnake/tgsnake',
      ref: 'dev',
      onProgress: (event) =>
        console.log(
          `git [${event.total ? (event.loaded / event.total).toFixed(2) : event.loaded}] - [${
            event.phase
          }]`
        ),
    });
  }
  if (!fs.existsSync(path.join(dir, 'node_modules'))) {
    if(fs.existsSync(path.join(dir,'yarn.lock'))) await fs.unlinkSync(path.join(dir,'yarn.lock'));
    console.log('installing dependencies and Building typedoc');
    await exec(
      'yarn install && yarn typedoc && mv ./beta ../public/beta',
      { cwd: dir },
      (err, stdout, stderr) => {
        if (err) console.log('[error] ', err);
        if (stdout) console.log(stdout);
        if (stderr) console.log('[error] ', stderr);
      }
    );
  } else {
    console.log('Building typedoc');
    await exec('yarn typedoc && mv ./beta ../public/beta', { cwd: dir }, (err, stdout, stderr) => {
      if (err) console.log('[error] ', err);
      if (stdout) console.log(stdout);
      if (stderr) console.log('[error] ', stderr);
    });
  }
  return true;
}

module.exports = { Typedoc };
