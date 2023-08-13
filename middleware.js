/**
 * tgsnake - Telegram MTProto framework for nodejs.
 * Copyright (C) 2023 butthx <https://github.com/butthx>
 *
 * THIS FILE IS PART OF TGSNAKE
 *
 * tgsnake is a free software : you can redistribute it and/or modify
 * it under the terms of the MIT License as published.
 */
import { NextRequest, NextResponse } from 'next/server';

let regex = /^\/?((pages|api)|((.*\/)?images))/i;
export async function middleware(req) {
  let userAgent = req.headers.get('user-agent');
  if (userAgent == 'TelegramBot (like TwitterBot)' && !regex.test(req.nextUrl.pathname)) {
    let home = ['/'];
    let paths = `/pages/${
      home.includes(req.nextUrl.pathname) ? `index.html` : `${req.nextUrl.pathname}.html`
    }`;
    let url =
      process.env.VERCEL_URL && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'
        ? `https://${process.env.VERCEL_URL}`
        : 'https://tgsnake.js.org';
    let res = await fetch(`${url}/api/content.json`);
    let json = (await res.json()) || [];
    console.log(`${userAgent} - ${paths}`);
    if (json.includes(paths.replace(/\.html$/, ''))) {
      return NextResponse.rewrite(`${url}/${paths}`);
    }
  }
  return;
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
