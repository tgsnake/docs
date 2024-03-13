'use server';
import { redirect } from 'next/navigation';
import slugify from 'slugify';
import crypto from 'crypto';
import { MongooseClient } from '@/libs/mongoose.lib';
import { upload } from '@/libs/filebase.lib';
import BlogModel from '@/models/blog.model';
import ImageModel from '@/models/image.model';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

export async function handleSubmition(form) {
  const session = await getIronSession(cookies(), {
    password: [process.env.PWD_1, process.env.PWD_2, process.env.PWD_3],
    cookieName: process.env.COOKIE_NAME,
    cookieOptions: {
      secure: true,
      sameSite: 'strict',
      path: '/',
    },
  });
  if (!session.logined || !session.admin) {
    return redirect('/blog');
  }
  await MongooseClient();
  const file = form.get('thumbnail');
  const saved = await BlogModel.findOne({
    slug: slugify(form.get('title'), { lower: true, strict: true }),
  });
  if (saved !== null) {
    // ignore the zero bytes
    if (file.size > 0) {
      const images = await uploadImage([file]);
      saved.thumbnail = images[0];
    }
    saved.description = form.get('description');
    saved.content = form.get('content');
    const isNewAuthor = saved.author.findIndex((el) => el.id === session.id);
    if (isNewAuthor < 0) {
      saved.author.push({
        name: session.name,
        id: session.id,
        photo: session.photo,
        username: session.username,
      });
    }
    await saved.save();
    return redirect(`/blog/${saved.slug}`);
  }
  const images = await uploadImage([file]);
  const newPost = new BlogModel({
    title: form.get('title'),
    description: form.get('description'),
    content: form.get('content'),
    thumbnail: images[0],
    author: [
      {
        name: session.name,
        id: session.id,
        photo: session.photo,
        username: session.username,
      },
    ],
  });
  await newPost.save();
  return redirect(`/blog/${newPost.slug}`);
  // return redirect('/blog');
}
export async function uploadImage(files) {
  const results = [];
  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const hash = md5(bytes);
    const same = await findImage(hash);
    if (same) {
      results.push(same.url);
    } else {
      const url = await upload(bytes, file.name, file.type);
      const db = new ImageModel({
        name: file.name,
        mimetype: file.type,
        md5: hash,
        url: url,
      });
      await db.save();
      results.push(url);
    }
  }
  return results;
}

async function findImage(md5) {
  await MongooseClient();
  const saved = await ImageModel.findOne({ md5: md5 });
  if (saved !== null) {
    return saved;
  }
  return false;
}
function md5(buffer) {
  return crypto.createHash('md5').update(buffer).digest().toString('hex');
}
