/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
const { Feed } = require('feed');
const { ReplaceWith, CreateList, Parser } = require('../parser');
const { getAllFilesRecursively } = require('../file');
const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');
const prettier = require('prettier');
const marked = require('marked');

function execAll(text, regex) {
  let list = [];
  let ex;
  while ((ex = regex.exec(text))) {
    list.push(ex);
  }
  return list;
}
async function Rss() {
  const files = await getAllFilesRecursively('./pages');
  const feed = new Feed({
    title: 'tgsnake rss',
    description: 'Rss feed for tgsnake!',
    id:
      process.env.VERCEL_URL && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
        ? `https://${process.env.VERCEL_URL}`
        : 'https://tgsnake.js.org',
    link:
      process.env.VERCEL_URL && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
        ? `https://${process.env.VERCEL_URL}`
        : 'https://tgsnake.js.org',
    language: 'en',
    image: 'https://tgsnake.js.org/images/tgsnake.jpg',
    copyright: `MIT ${new Date().getFullYear()} © butthx.`,
    feedLinks: {
      json: path.join(
        process.env.VERCEL_URL && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
          ? `https://${process.env.VERCEL_URL}`
          : 'https://tgsnake.js.org',
        'rss/feed.json',
      ),
      atom: path.join(
        process.env.VERCEL_URL && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
          ? `https://${process.env.VERCEL_URL}`
          : 'https://tgsnake.js.org',
        'rss/atom.xml',
      ),
      rss2: path.join(
        process.env.VERCEL_URL && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
          ? `https://${process.env.VERCEL_URL}`
          : 'https://tgsnake.js.org',
        'rss/feed.xml',
      ),
    },
    author: {
      name: 'tgsnake',
      link: 'https://t.me/tgsnake',
    },
  });
  for (let file of files) {
    if (!/\.(md|mdx)$/.test(file)) continue;
    const filename = file
      .replace('pages', '')
      .replace('/', '')
      .replace(/\.(md|mdx)$/, '');
    const language = filename.split('.').pop();
    const route = path.join(
      language == 'en' ? '/' : language,
      filename.replace(new RegExp(`.${language}$`, ''), ''),
    );
    const raw = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    const stat = fs.statSync(path.join(process.cwd(), file));
    const { content, data } = await matter(raw);
    const htmlContent = await marked.parse(
      await prettier.format(content, {
        semi: false,
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        parser: 'markdown',
      }),
    );
    let { results, fragment } = await Parser(htmlContent, filename);
    for (let match of execAll(results, /\<p\>(\<img(.*)(\/)?\>)\<\/p\>/gm)) {
      let [full, img] = match;
      results = results.replace(full, img);
    }
    feed.addItem({
      title: data.title ?? 'tgsnake',
      id: path.join(
        process.env.VERCEL_URL && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
          ? `https://${process.env.VERCEL_URL}`
          : 'https://tgsnake.js.org',
        route,
      ),
      link: path.join(
        process.env.VERCEL_URL && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
          ? `https://${process.env.VERCEL_URL}`
          : 'https://tgsnake.js.org',
        route,
      ),
      description: 'Telegram MTProto Framework for Typescript/Javascript based on gramjs.',
      content: `<article>${results}</article>`,
      author: [
        {
          name: 'tgsnake',
          link: 'https://t.me/tgsnake',
        },
      ],
      date: new Date(stat.mtime),
    });
  }
  if (!fs.existsSync('./public/rss')) {
    fs.mkdirSync('./public/rss', { recursive: true });
  }
  fs.writeFileSync('./public/rss/feed.xml', feed.rss2());
  fs.writeFileSync('./public/rss/atom.xml', feed.atom1());
  fs.writeFileSync('./public/rss/feed.json', feed.json1());
  return feed;
}

Rss();
