/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2024 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */

import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import message from './message.js';

const CORE_TYPES = new Set([
  0xbc799737, // boolFalse#bc799737 = Bool;
  0x997275b5, // boolTrue#997275b5 = Bool;
  0x3fedd339, // true#3fedd339 = True;
  0xc4b9f9bb, // error#c4b9f9bb code:int text:string = Error;
  0x56730bcc, // null#56730bcc = Null;
  0x1cb5c415, // vector#1cb5c415 {t:Type} # [ t ] = Vector t;
]);
const AUTH_KEY_TYPES = new Set([
  0x05162463, // resPQ,
  0x83c95aec, // p_q_inner_data
  0xa9f55f95, // p_q_inner_data_dc
  0x3c6a84d4, // p_q_inner_data_temp
  0x56fddf88, // p_q_inner_data_temp_dc
  0xd0e8075c, // server_DH_params_ok
  0xb5890dba, // server_DH_inner_data
  0x6643b654, // client_DH_inner_data
  0xd712e4be, // req_DH_params
  0xf5045f1f, // set_client_DH_params
  0x3072cfa1, // gzip_packed
]);
const reNamespace = /((\w+\.)?(\w+))#(\w+)\s+/m; // /([\w.]+)#(\w+)\s+/m;
const reArgs = /(\w+):([\w?!.<>#]+)/g;
const reResult = /\s+([\w<>.]+);$/;
const flagsArgType = /flags(\d+)?.(\d+)\?([\w?!.<>#]+)/;
const flagsArg = /flags(\d+?):#/;
const lineSection = /---(\w+)---/;
const layerSection = /\/\/\s+LAYER\s+(\d+)/;
const layerSecretChat = /={3}(\d+)={3}/;
const VECTOR_CORE_TYPES = new Set([
  'int',
  'long',
  'int128',
  'int256',
  'double',
  'bytes',
  'string',
  'Bool',
  'true',
]);

// https://stackoverflow.com/questions/54242239/how-to-convert-snake-case-to-camelcase-in-typescripts
const snakeCaseToCamelCase = (input) =>
  input
    .split('_')
    .reduce(
      (res, word, i) =>
        i === 0
          ? word.toLowerCase()
          : `${res}${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`,
      '',
    );
// https://stackoverflow.com/questions/54246477/how-to-convert-camelcase-to-snake-case-in-javascript
const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
function execAll(text, regex) {
  let list = [];
  let ex;
  while ((ex = regex.exec(text))) {
    list.push(ex);
  }
  return list;
}
function makeCRCTable() {
  var c;
  var crcTable = [];
  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
}
function crc32(str) {
  str = Buffer.isBuffer(str) ? str.toString('utf8') : str;
  var crcTable = makeCRCTable();
  var crc = 0 ^ -1;
  for (var i = 0; i < str.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}
function Uppercase(text) {
  return text.replace(text[0], text[0].toUpperCase());
}
function replacer(input, replace) {
  let results = input;
  for (let [key, value] of Object.entries(replace)) {
    results = results.replace(new RegExp(`{{( )?(${key})( )?}}`, 'gm'), value);
  }
  return results;
}

function parseArgName(argname) {
  switch (argname) {
    case 'default':
      return '_default';
      break;
    case 'delete':
      return '_delete';
      break;
    case 'static':
      return '_static';
      break;
    case 'public':
      return '_public';
      break;
    case 'private':
      return '_private';
    default:
      return argname;
  }
}

function getLastMatch(inputText, regex) {
  const match = inputText.match(new RegExp(regex, 'g'));
  if (match) {
    return match[match.length - 1].match(regex);
  }
  return match;
}

async function start(
  source,
  template_page,
  template_constructor,
  template_namespace,
  index_template,
  language,
) {
  let currentLayer;
  let layer = source.match(/\/\/\s+LAYER\s+(\d+)/i)[1];
  let section = 'types';
  let hsclayer = Number(getLastMatch(source, layerSecretChat)[1])
    ? Number(getLastMatch(source, layerSecretChat)[1])
    : 8; // Highest secret chat schema layer, the initial schema is 8
  let typesMap = new Map();
  let typeSubclassMap = new Map();
  let docsMap = new Map();
  let routesMap = new Map();
  let passedId = [];
  docsMap.set('functions', new Map());
  docsMap.set('types', new Map());

  function getType(type, markdown = false) {
    switch (type) {
      case 'string':
        return markdown
          ? '[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)'
          : 'string';
        break;
      case 'true':
      case 'false':
      case 'Bool':
        return markdown
          ? '[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)'
          : 'boolean';
        break;
      case '!X':
      case 'X':
      case 'Type':
        return 'TLObject';
        break;
      case 'Object':
        return markdown
          ? '[any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)'
          : 'any';
        break;
      case 'int128':
      case 'int256':
      case 'long':
        return markdown
          ? '[bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)'
          : 'bigint';
        break;
      case 'bytes':
        return markdown
          ? '[Buffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)'
          : 'Buffer';
        break;
      case 'int':
      case 'double':
      case 'float':
        return markdown
          ? '[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)'
          : 'number';
        break;
      default:
        let reDefault =
          /^(X|Type|Bool|int|double|float|int128|int256|long|bytes|Vector<(\w+\.?\w+?)>|string|number)$/i;
        if (reDefault.test(type.trim())) {
          if (/Vector<(\w+\.?\w+?)>/i.test(type.trim())) {
            let [full, vectorType] = type.trim().match(/Vector<(\w+\.?\w+?)>/i);
            return markdown
              ? `[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of ${getType(vectorType, markdown)}`
              : `Array<${getType(vectorType, markdown)}>`;
          }
          return type;
        }
        let typeSplit = type.trim().split('.');
        let typeName =
          typeSplit.length > 1
            ? `${typeSplit[0]}.Type${Uppercase(
                typeSplit[1].includes('_') ? snakeCaseToCamelCase(typeSplit[1]) : typeSplit[1],
              )}`
            : `Type${Uppercase(
                typeSplit[0].includes('_') ? snakeCaseToCamelCase(typeSplit[0]) : typeSplit[0],
              )}`;
        if (!typesMap.has(typeName)) {
          typesMap.set(typeName, crc32(type.trim()));
          routesMap.set(
            typeName,
            `/${language}/tgsnake/core/${path.join('raw', ...typeName.split('.')).toLowerCase()}`,
          );
        }
        // console.log(typeName, typeSplit)
        return markdown && routesMap.get(typeName)
          ? `[Raw.${typeName}](${routesMap.get(typeName)})`
          : `Raw.${typeName}`;
    }
  }

  for (let line of source.split('\n')) {
    if (lineSection.test(line.trim())) {
      let match = line.trim().match(lineSection);
      section = match[1];
      continue;
    }
    if (layerSecretChat.test(line.trim())) {
      let match = line.trim().match(layerSecretChat);
      currentLayer = Number(match[1]);
      continue;
    }
    if (!line.startsWith('//')) {
      if (line.trim() === '') continue;
      let [input, full, namespace, name, id] = line.trim().match(reNamespace);
      if (CORE_TYPES.has(parseInt(id, 16))) continue;
      let [resultsFull, results] = line.trim().match(reResult);
      let hasFlags = flagsArg.test(line);
      let slots = [];
      let interfaceArgsString = '';
      let properties = '';
      if (full.includes('_')) {
        full = snakeCaseToCamelCase(full);
        if (namespace) namespace = snakeCaseToCamelCase(namespace);
        name = snakeCaseToCamelCase(name);
      }
      name = Uppercase(name);
      if (currentLayer) {
        name = `${name}${currentLayer}`;
      }
      let route = path.join(
        'tgsnake/core/raw',
        (namespace ?? '').toLowerCase().replace('.', '').trim(),
        name.toLowerCase().trim(),
      );
      routesMap.set(`Raw.${namespace ?? ''}${name}`, `/${language}/${route}`);
      // to prevent clashes, ignore schemas that have the same id
      if (!passedId.includes(id)) {
        passedId.push(id);
        if (section === 'types') {
          if (typeSubclassMap.has(crc32(results))) {
            typeSubclassMap.set(
              crc32(results),
              `${typeSubclassMap.get(crc32(results))}\n- [Raw.${namespace ?? ''}${name}](/${language}/${route})   `,
            );
            if (Uppercase(full) === results) {
              typeSubclassMap.set(
                crc32(camelToSnakeCase(full)),
                `${typeSubclassMap.get(crc32(results))}\n- [Raw.${namespace ?? ''}${name}](/${language}/${route})   `,
              );
            }
          } else {
            typeSubclassMap.set(
              crc32(results),
              `- [Raw.${namespace ?? ''}${name}](/${language}/${route})   `,
            );
            if (Uppercase(full) === results) {
              typeSubclassMap.set(
                crc32(camelToSnakeCase(full)),
                `- [Raw.${namespace ?? ''}${name}](/${language}/${route})   `,
              );
            }
          }
        }
        for (let [argFull, argName, argType] of execAll(line.trim(), reArgs)) {
          if (argFull === 'X:Type') continue; // skip the {X:Type} args
          argName = snakeCaseToCamelCase(argName);
          if (AUTH_KEY_TYPES.has(parseInt(id, 16))) {
            if (argType === 'string') {
              argType = 'bytes';
            }
          }
          let flag = argType.trim().match(flagsArgType);
          if (/flags(\d+)?/.test(argName) && argType === '#') continue;
          if (flag) {
            let [flagFull, flagNumber, flagIndex, flagType] = flag;
            if (!flagsArg.test(argName)) {
              interfaceArgsString += `    ${argName}?:${getType(flagType)};\n`;
              properties += `- \`${argName}\` : ${getType(flagType, true)} or [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)\n`;
              if (!slots.includes(argName.trim())) slots.push(argName.trim());
            }
          } else {
            if (!flagsArg.test(argName)) {
              interfaceArgsString += `    ${argName}:${getType(argType)};\n`;
              properties += `- \`${argName}\` : ${getType(argType, true)}\n`;
              if (!slots.includes(argName.trim())) slots.push(argName.trim());
            }
          }
        }
        let constr = replacer(template_constructor, {
          'constructor-name': name,
          slots: slots.join(', '),
          interface: interfaceArgsString.replace(/\n$/, ''),
        });
        let content = await prettier.format(
          replacer(template_namespace, {
            name: 'Raw',
            content: namespace
              ? replacer(template_namespace, {
                  name: namespace.replace('.', ''),
                  content: constr,
                })
              : constr,
          }),
          {
            semi: true,
            singleQuote: true,
            printWidth: 100,
            tabWidth: 2,
            useTabs: false,
            bracketSpacing: true,
            parser: 'typescript',
          },
        );
        let page = replacer(template_page, {
          title: `Raw.${namespace ?? ''}${name}`,
          class: content,
          'callout-type': section === 'functions' ? 'info' : 'error',
          'callout-message':
            section === 'functions'
              ? message[language]
                ? message[language].functions
                : message.en.functions
              : message[language]
                ? message[language].types
                : message.en.types,
          layer: layer,
          'constructor-id': `0x${id}`,
          'tl-schema': line,
          results: section === 'functions' ? `## Results\n${getType(results, true)}` : '',
          property: properties.replace(/\n$/, ''),
        });
        if (namespace) {
          let mapping_namespace = docsMap.get(section === 'functions' ? 'functions' : 'types');
          let mapping = mapping_namespace.get(namespace.replace('.', ''));
          if (mapping) {
            mapping.set(name, page);
          } else {
            mapping = new Map();
            mapping.set(name, page);
            mapping_namespace.set(namespace.replace('.', ''), mapping);
          }
        } else {
          let mapping_namespace = docsMap.get(section === 'functions' ? 'functions' : 'types');
          let mapping = mapping_namespace.get('');
          if (mapping) {
            mapping.set(name, page);
          } else {
            mapping = new Map();
            mapping.set(name, page);
            mapping_namespace.set('', mapping);
          }
        }
      }
    }
  }
  for (let [key, value] of typesMap) {
    if (!typeSubclassMap.has(value)) {
      throw new Error(`Can't parsing type ${key} with id ${value}`);
    }
    let mapping_namespace = docsMap.get('types');
    if (key.includes('.')) {
      let [ns, ty] = key.split('.');
      let mapping = mapping_namespace.get(ns.replace('.', ''));
      let content = replacer(index_template, {
        title: key,
        list: typeSubclassMap.get(value),
      });
      mapping.set(ty, content);
    } else {
      let mapping = mapping_namespace.get('');
      let content = replacer(index_template, {
        title: key,
        list: typeSubclassMap.get(value),
      });
      mapping.set(key, content);
    }
  }
  let indexNs = new Map();
  let finalDocsMap = new Map();
  for (let [state, content_state] of docsMap) {
    for (let [ns, ty] of content_state) {
      let content = `## ${Uppercase(state)}\n`;
      for (let [name, _] of ty) {
        if (ns === '') {
          content += `- [${Uppercase(name)}](/${language}/tgsnake/core/raw/${name.toLowerCase()})   \n`;
        } else {
          content += `- [${Uppercase(name)}](/${language}/tgsnake/core/raw/${ns.toLowerCase()}/${name.toLowerCase()})   \n`;
        }
      }
      let mappingNs = indexNs.get(ns);
      let fdcmap = finalDocsMap.get(ns);
      if (mappingNs) {
        indexNs.set(ns, `${mappingNs}\n${content}`);
      } else {
        indexNs.set(ns, content);
      }
      if (fdcmap) {
        finalDocsMap.set(ns, new Map([...fdcmap, ...ty]));
      } else {
        finalDocsMap.set(ns, ty);
      }
    }
  }
  let tempMainIndex = '## Namespace\n';
  for (let key of indexNs.keys()) {
    if (key !== '') {
      tempMainIndex += `- [${key}](/${language}/tgsnake/core/raw/${key})   \n`;
    }
  }
  let mainIndex = indexNs.get('');
  if (mainIndex) {
    indexNs.set('', `${tempMainIndex}\n${mainIndex}`);
  }
  for (let [ns, ty] of indexNs) {
    let content = replacer(index_template, {
      title: Uppercase(ns === '' ? 'raw' : ns),
      list: ty,
    });
    let nsmap = finalDocsMap.get(ns);
    if (nsmap) {
      nsmap.set('', content);
    } else {
      nsmap = new Map();
      nsmap.set('', content);
      finalDocsMap.set(ns, nsmap);
    }
  }
  return finalDocsMap;
}

async function generate() {
  const schema = await fetch(
    'https://raw.githubusercontent.com/tgsnake/core/master/generator/api/source/api.tl',
  ).then((res) => res.text());
  const mtproto = await fetch(
    'https://raw.githubusercontent.com/tgsnake/core/master/generator/api/source/mtproto.tl',
  ).then((res) => res.text());
  const secretchat = await fetch(
    'https://raw.githubusercontent.com/tgsnake/core/master/generator/api/source/secretchat.tl',
  ).then((res) => res.text());
  const page = fs.readFileSync(path.join(import.meta.dirname, './template/page.txt'), 'utf8');
  const construct = fs.readFileSync(
    path.join(import.meta.dirname, './template/constructor.txt'),
    'utf8',
  );
  const namespace = fs.readFileSync(
    path.join(import.meta.dirname, './template/namespace.txt'),
    'utf8',
  );
  const indx = fs.readFileSync(path.join(import.meta.dirname, './template/index.txt'), 'utf8');
  const index = fs.readFileSync(path.join(import.meta.dirname, './template/index.txt'), 'utf8');
  for (let i18n of fs.readdirSync(path.join(process.cwd(), 'pages'))) {
    if (fs.statSync(path.join(process.cwd(), 'pages', i18n)).isDirectory()) {
      let results = await start(
        mtproto + '\n---types---\n' + schema + '\n---types---\n' + secretchat,
        page,
        construct,
        namespace,
        indx,
        i18n,
      );
      const rawMeta = {};
      for (let [ns, ty] of results) {
        const meta = {};
        for (let [name, content] of ty) {
          if (ns === '') {
            if (!fs.existsSync(path.join(process.cwd(), 'pages', i18n, 'tgsnake', 'core', 'raw'))) {
              fs.mkdirSync(path.join(process.cwd(), 'pages', i18n, 'tgsnake', 'core', 'raw'), {
                recursive: true,
              });
            }
            if (name === '') {
              fs.writeFileSync(
                path.join(process.cwd(), 'pages', i18n, 'tgsnake', 'core', 'raw.mdx'),
                content,
              );
            } else {
              rawMeta[name.toLowerCase()] = {
                type: 'pages',
              };
              fs.writeFileSync(
                path.join(
                  process.cwd(),
                  'pages',
                  i18n,
                  'tgsnake',
                  'core',
                  'raw',
                  `${name.toLowerCase()}.mdx`,
                ),
                content,
              );
            }
          } else {
            if (
              !fs.existsSync(
                path.join(process.cwd(), 'pages', i18n, 'tgsnake', 'core', 'raw', ns.toLowerCase()),
              )
            ) {
              fs.mkdirSync(
                path.join(process.cwd(), 'pages', i18n, 'tgsnake', 'core', 'raw', ns.toLowerCase()),
                {
                  recursive: true,
                },
              );
            }
            if (name === '') {
              rawMeta[ns.toLowerCase()] = {
                type: 'page',
              };
              fs.writeFileSync(
                path.join(
                  process.cwd(),
                  'pages',
                  i18n,
                  'tgsnake',
                  'core',
                  'raw',
                  `${ns.toLowerCase()}.mdx`,
                ),
                content,
              );
            } else {
              meta[name.toLowerCase()] = {
                type: 'pages',
              };
              fs.writeFileSync(
                path.join(
                  process.cwd(),
                  'pages',
                  i18n,
                  'tgsnake',
                  'core',
                  'raw',
                  ns.toLowerCase(),
                  `${name.toLowerCase()}.mdx`,
                ),
                content,
              );
            }
          }
        }
        if (ns !== '') {
          fs.writeFileSync(
            path.join(process.cwd(), 'pages', i18n, 'tgsnake', 'core', 'raw', ns, `_meta.jsx`),
            await prettier.format(`export default ${JSON.stringify(meta)}`, {
              semi: true,
              singleQuote: true,
              printWidth: 100,
              tabWidth: 2,
              useTabs: false,
              bracketSpacing: true,
              parser: 'typescript',
            }),
          );
        }
      }
      fs.writeFileSync(
        path.join(process.cwd(), 'pages', i18n, 'tgsnake', 'core', 'raw', `_meta.jsx`),
        await prettier.format(`export default ${JSON.stringify(rawMeta)}`, {
          semi: true,
          singleQuote: true,
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          bracketSpacing: true,
          parser: 'typescript',
        }),
      );
    }
  }
}
generate();
