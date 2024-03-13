import { NextResponse } from 'next/server';
import Model from '@/models/blog.model';
import { MongooseClient } from '@/libs/mongoose.lib';
import { uploadImage } from '@/components/handlePostContent';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  await MongooseClient();
  const searchParams = req.nextUrl.searchParams;
  const has = searchParams.get('has');
  const find = searchParams.get('find');
  if (has) {
    const data = await Model.findOne({ slug: has });
    return NextResponse.json({ has: data !== null });
  }
  if (find) {
    const data = await Model.findOne({ slug: find });
    if (data === null) {
      return NextResponse.json({ found: false }, { status: 404 });
    }
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
    return NextResponse.json({
      found: true,
      key: data.slug,
      title: data.title,
      description: data.description,
      content: data.content,
      thumbnail: data.thumbnail,
      author: data.author,
      date: pdate,
    });
  }
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
  return NextResponse.json(parses);
}

export async function POST(req) {
  await MongooseClient();
  const form = await req.formData();
  const files = form.getAll('files');
  const urls = await uploadImage(files);
  return NextResponse.json({ url: urls });
}
