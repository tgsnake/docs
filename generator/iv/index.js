/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
const { ReplaceWith, Parser } = require('../parser');
const { html } = require('./template');
const { getAllFilesRecursively } = require('../file');
const path = require('path');
const fs = require('fs');
const prettier = require('prettier');
const marked = require('marked');
const matter = require('gray-matter');

function execAll(text, regex) {
  let list = [];
  let ex;
  while ((ex = regex.exec(text))) {
    list.push(ex);
  }
  return list;
}
async function IV() {
  const page = [];
  const files = await getAllFilesRecursively('./pages');
  for (let file of files) {
    if (!/\.(md|mdx)$/.test(file)) continue;
    const filename = file
      .replace('pages', '')
      .replace('/', '')
      .replace(/\.(md|mdx)$/, '');
    const raw = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    const { content, data } = await matter(raw);
    const meta = Object.assign(
      {
        title: 'tgsnake',
      },
      data,
    );
    const htmlContent = await marked.parse(
      await prettier.format(content, {
        semi: false,
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        parser: 'markdown',
      }),
    );
    const { results, fragment } = await Parser(htmlContent, file);
    let ivContent = await prettier.format(
      await ReplaceWith(html, {
        title: meta.title,
        date: new Date().toISOString(),
        image: 'https://tgsnake.js.org/images/tgsnake.jpg',
        content: results,
      }),
      {
        semi: false,
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        parser: 'html',
      },
    );
    for (let match of execAll(ivContent, /\<p\>(\<img(.*)(\/)?\>)\<\/p\>/gm)) {
      let [full, img] = match;
      ivContent = ivContent.replace(full, img);
    }
    let outdir = path.join('./public/pages', `/${filename}.html`);
    let jsondir = path.join('./public/pages', `/${filename}.json`);
    page.push(
      jsondir
        .replace(/(\.json$)/, '')
        .replace('public', '')
        .trim(),
    );
    let splited = outdir.split('/');
    splited.splice(splited.length - 1, 1);
    let folder = splited[0];
    for (let i = 0; i < splited.length; i++) {
      if (i == 0) {
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
      } else {
        folder += splited[i];
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
      }
      folder += '/';
    }
    fs.writeFileSync(outdir, ivContent);
    fs.writeFileSync(
      jsondir,
      await prettier.format(
        JSON.stringify({
          fragment: fragment,
          meta: meta,
          filename: filename,
        }),
        {
          semi: false,
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          jsxSingleQuote: true,
          parser: 'json',
        },
      ),
    );
  }
  if (!fs.existsSync('./public/api')) fs.mkdirSync('./public/api');
  let final = JSON.stringify(page, null, 2);
  fs.writeFileSync(
    `./public/api/content.json`,
    await prettier.format(final, {
      semi: false,
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      jsxSingleQuote: true,
      parser: 'json',
    }),
  );
  return page;
}
IV();
