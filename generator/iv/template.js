/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="follow, index" />
    <meta
      name="description"
      content="Telegram MTProto framework for typescript or javascript."
    />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="tgsnake documentation" />
    <meta
      property="og:description"
      content="Telegram MTProto framework for typescript or javascript."
    />
    <meta
      property="og:image"
      content="https://tgsnake-butthx.vercel.app/api/og?title={{title}}"
      key="https://tgsnake.js.org/images/tgsnake.jpg"
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="tgsnake.js.org" />
    <meta
      name="twitter:description"
      content="Telegram MTProto framework for typescript or javascript."
    />
    <meta name="twitter:image" content="https://tgsnake-butthx.vercel.app/api/og?title={{title}}" />
    <meta name="article:author" content="tgsnake" />
    <meta property="telegram:channel" content="@tgsnake" />
    <meta property="al:android:app_name" content="Medium" />
    <meta property="article:published_time" content="{{date}}">
    <title>{{title}}</title>
  </head>
  <body>
    <article class="article__content">
      {{content}}
    </article>
  </body>
</html>`;
module.exports = { html };
