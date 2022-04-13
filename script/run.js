// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
const { IV } = require('./IV');
const { Rss } = require('./rss');
const { Typedoc } = require('./typedoc');
(async () => {
  if(!process.env.VERCEL && !process.env.VERCEL_ENV){
    return false;
  }
  console.log('Generating Rss');
  Rss();
  console.log('Generating Api');
  IV();
  console.log('Generating Typedoc');
  Typedoc();
})();
