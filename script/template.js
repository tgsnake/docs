// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
const html = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<meta name="robots" content="follow, index" />\n<meta name="description" content="Telegram MTProto Framework for Typescript/Javascript based on gramjs."/>\n<meta property="og:type" content="website" />\n<meta property="og:site_name" content="tgsnake documentation"/>\n<meta property="og:description" content="Telegram MTProto Framework for Typescript/Javascript based on gramjs." />\n<meta property="og:image" content="{{image}}" key="{{image}}" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:site" content="tgsnake.js.org" />\n<meta name="twitter:description" content="Telegram MTProto Framework for Typescript/Javascript based on gramjs." />\n<meta name="twitter:image" content="{{image}}" />\n<meta name="author" content="tgsnake"/>\n<meta property="al:android:app_name" content="Medium" />\n<meta property="article:published_time" content="{{date}}" />\n<meta name="telegram:channel" content="@tgsnake" />\n<title>{{title}}</title>\n</head>\n<body>\n<article>\n{{content}}\n<related>\n<h2>Also Read</h2>\n{{related}}\n</related>\n</article>\n</body>\n</html>`;
module.exports = { html };
