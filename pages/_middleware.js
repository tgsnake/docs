import {NextRequest,NextResponse} from "next/server"

export default function middleware (req) {
  let userAgent = req.headers.get('user-agent');
  console.log(userAgent);
  if(userAgent.toLowerCase().trim() == "telegrambot"){
    return NextResponse.redirect(encodeURI(`https://t.me/iv?url=https://tgsnake.js.org${req.url.pathname}&rhash=ce6600454132da`))
  }
}