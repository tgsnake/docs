import { NextRequest, NextResponse } from 'next/server';
import path from "path";
let regex = /^\/?((pages|api)|((.*\/)?images))/i;
export async function middleware (req){
  let userAgent = req.headers.get("user-agent");
  if(userAgent == "TelegramBot (like TwitterBot)" && (!regex.test(req.nextUrl.pathname))){
    let locale = req.nextUrl.locale == 'default' ? 'en' : req.nextUrl.locale;
    console.log(locale);
    let home = ["/",locale,`/${locale}`,`/${locale}/`];
    let paths = path.join("/pages",home.includes(req.nextUrl.pathname) ? `${locale}/index.html` : `/${locale}/${req.nextUrl.pathname}.html`);
    let url = (process.env.VERCEL_URL && process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") ? `https://${process.env.VERCEL_URL}` : "https://tgsnake.js.org";
    let res = await fetch(`${url}/api/content.json`);
    let json = await res.json() || [];
    console.log(`${userAgent} - ${paths}`);
    if(json.includes(paths.replace(/\.html$/,""))){
      return NextResponse.rewrite(paths);
    }
    if(json.includes(paths.replace(`/pages/${locale}`,`/pages/en`).replace(/\.html$/,""))){
      console.log(`Redirecting to ${paths.replace(`/pages/${locale}`,`/pages/en`)}`);
      return NextResponse.rewrite(paths.replace(`/pages/${locale}`,`/pages/en`));
    }
    return NextResponse.rewrite(`/pages/unsupported.html`);
  }
  return;
}