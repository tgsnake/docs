import { NextResponse } from 'next/server';
import { objectToAuthDataMap, AuthDataValidator } from '@telegram-auth/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const session = await getIronSession(cookies(), {
    password: [process.env.PWD_1, process.env.PWD_2, process.env.PWD_3],
    cookieName: process.env.COOKIE_NAME,
    cookieOptions: {
      secure: true,
      sameSite: 'strict',
      path: '/',
    },
  });
  const body = await req.json();
  const validator = new AuthDataValidator({ botToken: process.env.BOT_TOKEN });
  const data = objectToAuthDataMap(body);
  const user = await validator.validate(data);
  session.logined = true;
  session.id = user.id;
  session.name = [user.first_name, user.last_name || ''].join(' ').trim();
  session.photo = user.photo_url || '/images/tgsnake.jpg';
  session.username = user.username;
  // check user is admin or not
  try {
    const member = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`,
      {
        method: 'POST',
        body: JSON.stringify({
          chat_id: String(process.env.CHAT_ID),
          user_id: user.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((res) => res.json());
    if (
      member.ok &&
      (member.result.status === 'administrator' || member.result.status === 'creator')
    ) {
      session.admin = true;
    } else {
      session.admin = false;
    }
  } catch (error) {
    session.admin = false;
  }
  await session.save();
  return NextResponse.json({ ok: true });
}
