'use server';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BlogModel from '@/models/blog.model';
import { MongooseClient } from '@/libs/mongoose.lib';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

async function getSource(slug) {
  await MongooseClient();
  const source = await BlogModel.findOne({ slug });
  const date = new Date(
    source.updatedAt !== source.createdAt ? source.updatedAt : source.createdAt,
  );
  const now = new Date();
  let pdate = date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  if (date.getDate() === now.getDate()) {
    if (now.getHours() - date.getHours() > 0) {
      pdate = `${now.getHours() - date.getHours()}h ago`;
    } else if (now.getMinutes() - date.getMinutes() > 0) {
      pdate = `${now.getMinutes() - date.getMinutes()}m ago`;
    } else if (now.getSeconds() - date.getSeconds() > 0) {
      pdate = `${now.getSeconds() - date.getSeconds()}s ago`;
    } else {
      pdate = 'now';
    }
  }
  return {
    key: source.slug,
    title: source.title,
    description: source.description,
    content: source.content,
    thumbnail: source.thumbnail,
    author: source.author,
    date: pdate,
  };
}
export async function deletePost(form) {
  await MongooseClient();
  await BlogModel.findOneAndDelete({ slug: form.get('slug') });
  await redirect('/blog');
}

const components = {
  Link,
  img: (props) => (
    <Image width={0} height={0} quality={75} sizes="fit" className="w-full img" {...props} />
  ),
};

export default async function Page({ params }) {
  const { slug } = params;
  const source = await getSource(slug);
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
      <div className="min-h-screen">
        <div>
          <Suspense
            fallback={
              <div className="animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded-md"></div>
            }
          >
            <Image
              src={source.thumbnail}
              width={0}
              height={0}
              quality={75}
              sizes="fit"
              className="w-full rounded-lg"
              alt={`Thumbnail`}
            />
          </Suspense>

          <div className="py-2 border-b border-gray-200 dark:border-gray-700 w-full">
            <Suspense
              fallback={
                <div className="animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded-md"></div>
              }
            >
              <p className="font-light">{source.date}</p>
              <h1 className="font-extrabold text-3xl md:text-4xl lg:text-5xl my-2">
                {source.title}
              </h1>
            </Suspense>
            <p className="mt-6 mb-4 font-light md:text-lg lg:text-xl">Posted by</p>
            <Suspense
              fallback={
                <div className="animate-pulse w-full h-5 bg-gray-400 dark:bg-gray-600 rounded-md"></div>
              }
            >
              <div className="flex items-center mb-4">
                {source.author.map((el, i) => (
                  <div className="mr-2" key={i}>
                    <div className="flex justify-between items-center">
                      <div className="avatar avatar-lg">
                        <img src={el.photo} alt="avatar" />
                      </div>
                      <div className="mx-2">
                        <p className="font-semibold">{el.name}</p>
                        <p className="font-light">{el.username || '@tgsnakedev'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Suspense>
            {session.logined && session.admin && (
              <>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/blog/post/edit?id=${slug}`}
                    className="w-2/4 bg-amber-400 dark:bg-amber-700 p-4 rounded-l-lg rounded-r-none cursor-pointer"
                  >
                    Edit
                  </Link>
                  <label
                    htmlFor="modal-1"
                    className="w-2/4 bg-red-500 p-4 rounded-l-none rounded-r-lg dark:bg-red-700 text-right cursor-pointer"
                  >
                    Delete
                  </label>
                </div>
                <input type="checkbox" id="modal-1" className="modal-state" />
                <div className="modal">
                  <label className="modal-overlay" htmlFor="modal-1"></label>
                  <div className="modal-content flex flex-col gap-5">
                    <label
                      htmlFor="modal-1"
                      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    >
                      ✕
                    </label>
                    <h2 className="text-xl">Are you sure to delete this?</h2>
                    <span>
                      Once you delete, you cannot restore this article again. All content provided
                      in this article will be deleted from the server permanently.
                    </span>
                    <div className="flex gap-3">
                      <form action={deletePost}>
                        <input name="slug" id="slug" type="text" value={slug} className="hidden" />
                        <input type="submit" id="submit" className="hidden" />
                      </form>
                      <label htmlFor="submit" className="btn btn-error btn-block">
                        Delete
                      </label>
                      <label htmlFor="modal-1" className="btn btn-block">
                        Cancel
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <article className="prose lg:prose-xl my-4 prose-neutral dark:text-white dark:prose-invert">
          <MDXRemote source={source.content} components={components} />
        </article>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  await MongooseClient();
  const posts = (await BlogModel.find({})) || [];
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
