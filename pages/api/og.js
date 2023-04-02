import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function (req) {
  const { searchParams } = new URL(req.url);
  // ?title=<title>
  const hasTitle = searchParams.has('title');
  const title = hasTitle ? searchParams.get('title') : '';
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: 'white',
        }}
      >
        <div tw='flex justify-center'>
          <img
            src={`${req.nextUrl.origin}/images/tgsnake.png`}
            width={320 * 2.5}
            height={180 * 2.5}
          />
        </div>
        <h1 tw='text-center mb-16 mt-2 font-extrabold text-black text-4xl'>{title}</h1>
      </div>
    )
  );
}
