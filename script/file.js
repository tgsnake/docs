// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
const fs = require('fs');
const path = require('path');
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);
const flattenArray = (input) =>
  input.reduce((acc, item) => [...acc, ...(Array.isArray(item) ? item : [item])], []);
const map = (fn) => (input) => input.map(fn);
const walkDir = (fullPath) => {
  return fs.statSync(fullPath).isFile() ? fullPath : getAllFilesRecursively(fullPath);
};
const pathJoinPrefix = (prefix) => (extraPath) => path.join(prefix, extraPath);
const getAllFilesRecursively = (folder) =>
  pipe(fs.readdirSync, map(pipe(pathJoinPrefix(folder), walkDir)), flattenArray)(folder);

module.exports = { getAllFilesRecursively };
