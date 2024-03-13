'use server';
import Link from 'next/link';
import Widget from '@//components/widget';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { Suspense } from 'react';

export default async function Dropdown() {
  const session = await getIronSession(cookies(), {
    password: [process.env.PWD_1, process.env.PWD_2, process.env.PWD_3],
    cookieName: process.env.COOKIE_NAME,
    cookieOptions: {
      secure: true,
      sameSite: 'strict',
      path: '/',
    },
  });
  return (
    <>
      <div className="dropdown">
        <label className="btn btn-solid-success my-2" tabIndex="0">
          You
        </label>
        <div className="dropdown-menu dropdown-menu-bottom-left gap-1">
          <Widget />
          <div className="dropdown-divider" role="separator"></div>
          <Suspense fallback={null}>
            <p
              tabIndex="-1"
              className={`btn text-sm font-semibold text-center ${session.logined && session.admin ? 'btn-solid-success' : 'btn-solid-error'}`}
            >
              {session.logined
                ? session.admin
                  ? 'You are admin'
                  : 'You are not admin'
                : 'Login required'}
            </p>
          </Suspense>
          <Suspense fallback={null}>
            {session.logined && session.admin && (
              <>
                <div className="dropdown-divider" role="separator"></div>
                <Link href="/blog/post/create" tabIndex="-1" className="dropdown-item text-sm">
                  New Post
                </Link>
              </>
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
}
