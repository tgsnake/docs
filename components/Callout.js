// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
const themes = {
  default: 'bg-orange-50 border border-orange-100 text-orange-800 dark:text-orange-300 dark:bg-orange-400 dark:border-orange-400 dark:bg-opacity-20 dark:border-opacity-30',
  error: 'bg-red-100 border border-red-200 text-red-900 dark:text-red-200 dark:bg-red-900 dark:bg-opacity-30 dark:border-opacity-30',
  warning: 'bg-yellow-50 border border-yellow-100 text-yellow-900 dark:text-yellow-200 dark:bg-yellow-700 dark:bg-opacity-30',
  success: 'bg-green-50 border border-green-100 text-green-900 dark:text-green-200 dark:bg-green-700 dark:bg-opacity-30',
  green: 'bg-green-50 border border-green-100 text-green-900 dark:text-green-200 dark:bg-green-700 dark:bg-opacity-30',
  blue: 'bg-blue-50 border border-blue-100 text-blue-900 dark:text-blue-200 dark:bg-blue-700 dark:bg-opacity-30',
  sky: 'bg-sky-50 border border-sky-100 text-sky-900 dark:text-sky-200 dark:bg-sky-700 dark:bg-opacity-30',
};
export default function Callout({ children, type = 'default', emoji = '💡' }) {
  return (
    <div className={`${themes[type]} flex rounded-lg callout mt-6`}>
      <div
        className='pl-3 pr-2 py-2 select-none text-xl'
        style={{
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
      >
        {emoji}
      </div>
      <div className='pr-4 py-2'>{children}</div>
    </div>
  );
}
