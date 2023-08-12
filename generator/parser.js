/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */

const path = require('path');
const htmlparser = require('htmlparser2');
class Fragment {
  constructor(tag, attr) {
    this.tag = tag;
    this.attr = attr;
    this.text = '';
    this.index = 0;
  }
}
async function Parser(content, filename) {
  const stack = [];
  const finalFragment = [];
  const remove = ['tabgroup'];
  const selfClose = ['br', 'img'];
  const filter = (fragment) => {
    let regex = /^import(.*)/;
    if (fragment && fragment.tag == 'p' && regex.test(fragment.text) && fragment.index == 0) {
      return true;
    }
    return false;
  };
  let results = '';
  let tempResults = '';
  let parser = new htmlparser.Parser({
    onopentag: (tag, attr) => {
      let fragment = new Fragment(tag, attr);
      fragment.index = results.length;
      stack.push(fragment);
      if (!filter(fragment)) {
        switch (tag) {
          case 'ol':
            tempResults = '<ul';
            for (let [key, value] of Object.entries(attr)) {
              tempResults += ` ${key.replace('classname', 'class')}="${value}"`;
            }
            tempResults += `>`;
            break;
          case 'tabcontent':
            tempResults += `<details><summary><span>${attr.name}</span></summary>`;
            break;
          case 'callout':
            tempResults = '<blockquote>';
            break;
          case 'detailsgroup':
            tempResults += `<details><summary><span>${attr.summary}</span></summary>`;
            break;
          default:
            if (remove.includes(tag)) {
              return (tempResults = '');
            }
            tempResults += `<${tag}`;
            for (let [key, value] of Object.entries(attr)) {
              if (/^(\/|\.\.?\/|~\/)/i.test(String(value))) {
                let d = path.join(Array(filename.split('/').length).fill('..').join('/'), value);
                value = d;
              }
              tempResults += ` ${key.replace('classname', 'class')}="${value}"`;
            }
            if (selfClose.includes(tag)) {
              tempResults += `/>`;
            } else {
              tempResults += `>`;
            }
        }
      }
    },
    ontext: (text) => {
      text = text.replace(/\</gm, '&lt;').replace(/\>/gm, '&gt;');
      let fragment = stack[stack.length - 1];
      if (fragment) fragment.text += text;
      if (fragment && remove.includes(fragment.tag)) {
        return (tempResults = '');
      }
      if (!filter(fragment)) {
        tempResults += text;
      }
    },
    onclosetag: (tag) => {
      let fragment = stack.pop();
      let tagname = tag;
      finalFragment.push(fragment);
      if (!filter(fragment)) {
        switch (tag) {
          case 'ol':
            tagname = 'ul';
            break;
          case 'tabcontent':
            tagname = 'details';
            break;
          case 'callout':
            tagname = 'blockquote';
            break;
          case 'detailsgroup':
            tagname = 'details';
            break;
          default:
            tagname = tag;
        }
        if (!selfClose.includes(tag)) tempResults += `</${tagname}>`;
        if (remove.includes(tag)) {
          return (tempResults = '');
        } else {
          results += tempResults;
        }
      }
      tempResults = '';
    },
  });
  await parser.write(content);
  await parser.end();
  return { results, fragment: finalFragment };
}
function CreateList(lists, contentPath) {
  let route = {};
  let final = {};
  for (let list of lists) {
    let name = list
      .replace(contentPath.replace('./', ''), '')
      .replace('/', '')
      .replace(/\.(md|mdx)$/, '');
    if (!/\.(md|mdx)$/.test(list)) continue;
    let language = name.split('.').pop();
    if (!route[language]) route[language] = [];
    route[language].push(path.join(language, name.replace(new RegExp(`.${language}$`, ''), '')));
  }
  for (let language of Object.keys(route)) {
    if (language !== 'en') {
      if (route.en) {
        for (let en of route.en) {
          let enn = en.replace(new RegExp('^/?en', ''), '');
          if (!route[language].includes(path.join(language, enn))) route[language].push(en);
        }
      }
    }
  }
  for (let [key, value] of Object.entries(route)) {
    value.reverse();
    if (!final[key]) final[key] = '';
    for (let content of value) {
      final[key] += `<a href="/${content.replace(/index$/, '')}">/${content.replace(
        /index$/,
        '',
      )}</a>\n`;
    }
  }
  return final;
}
function ReplaceWith(content, replace) {
  if (typeof replace !== 'object') return content;
  for (let [key, value] of Object.entries(replace)) {
    content = content.replace(new RegExp(`{{${key}}}`, 'gm'), value);
  }
  return content;
}
module.exports = { Parser, Fragment, CreateList, ReplaceWith };
