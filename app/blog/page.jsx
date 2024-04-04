'use server';
import { Suspense } from 'react';
import Load from '@/components/load';
import Card from '@/components/card';
import Model from '@/models/blog.model';
import { MongooseClient } from '@/libs/mongoose.lib';

async function fetchData() {
  await MongooseClient();
  const datas = await Model.find({}).sort({ createdAt: -1 }).exec();
  const parses = datas.map((data, i) => {
    const date = new Date(data.updatedAt !== data.createdAt ? data.updatedAt : data.createdAt);
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
      key: data.slug,
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
      date: pdate,
    };
  });
  return parses;
}

export default async function Page() {
  const content = await fetchData();
  return (
    <>
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Interesting Post</h2>
        <article className="mt-4 pt-2 min-h-screen transition-all ease-in-out duration-300">
          <Suspense fallback={<Load />}>
            {content.map((el, i) => (
              <div className="py-2" key={i}>
                <Card
                  href={el.key}
                  title={el.title}
                  description={el.description}
                  thumbnail={el.thumbnail}
                  date={el.date}
                />
              </div>
            ))}
          </Suspense>
        </article>
      </div>
    </>
  );
}
