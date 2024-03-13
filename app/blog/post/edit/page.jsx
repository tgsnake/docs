'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import { handleSubmition } from '@/components/handlePostContent';
import Uploaded from '@/components/uploaded';
import slugify from 'slugify';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function New() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('id');
  const [previewThumb, setPreviewThumb] = useState();
  const [text, setText] = useState('');
  const [submited, setSubmited] = useState(false);
  const [theme, setTheme] = useState('light');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (slug === null) {
    redirect('/blog');
  }

  function handleUploadThumbPreview(event) {
    const files = Array.from(event.target.files);
    setPreviewThumb(URL.createObjectURL(files[0]));
  }
  async function handleUploadImage(files, callback) {
    const form = new FormData();
    for (const file of files) {
      form.append('files', file, file.name);
    }
    const res = await fetch(`/api/blog`, { method: 'POST', body: form, cache: 'no-store' }).then(
      (res) => res.json(),
    );
    callback(res.url);
  }
  async function getContent() {
    if (!title || !description || !content) {
      const content = await fetch(`/api/blog?find=${slug}`, {
        method: 'GET',
        cache: 'no-store',
      }).then((res) => res.json());
      if (!content.found) {
        return router.push('/blog');
      }
      setTitle(content.title);
      setDescription(content.description);
      setText(content.content);
      setPreviewThumb(content.thumbnail);
    }
  }

  function onSubmit(event) {
    setSubmited(true);
  }
  useEffect(() => {
    getContent();
    if (document.querySelector('html').classList.contains('dark')) {
      setTheme('dark');
    }
  }, []);
  return (
    <>
      {submited ? (
        <Uploaded />
      ) : title && previewThumb ? (
        <div className="py-6 px-4">
          <h1 className="text-2xl font-bold">Post Interesting Content</h1>
          <div className="md:flex">
            <div className="my-4 bg-gray-100 dark:bg-gray-900 p-4 rounded-xl md:w-1/2 md:mx-auto">
              <form action={handleSubmition} onSubmit={onSubmit}>
                <div className="mb-8">
                  <label htmlFor="thumbnail">
                    {previewThumb ? (
                      <div>
                        <Image
                          src={previewThumb}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="w-full rounded-lg"
                          alt="thumbnail"
                        />
                      </div>
                    ) : (
                      <div className="w-full bg-gray-200 dark:bg-gray-400 h-60 rounded-lg p-2 text-center items-center flex items-stretch">
                        <div className="m-auto">
                          <div className="flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 mx-auto"
                            >
                              <path
                                fillRule="evenodd"
                                d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h2 className="font-bold text-lg">Upload Thumbnail</h2>
                          <p className="font-light">
                            Click here to upload a thumbnail of this post.
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                  <input
                    name="thumbnail"
                    id="thumbnail"
                    className="hidden"
                    type="file"
                    onChange={handleUploadThumbPreview}
                    accept="image/*"
                  />
                </div>
                <div className="my-4">
                  <div className="relative mt-4">
                    <input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="title"
                      className="peer w-full bg-transparent border-b-2 placeholder-transparent h-10 my-1 focus:outline-none transition-all border-gray-400 focus:border-black"
                      value={title}
                      readonly="readonly"
                    />
                    <label
                      htmlFor="title"
                      className="absolute left-0 -top-3.5 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-placeholder-shown:text-gray-400  peer-focus:text-black"
                    >
                      Title
                    </label>
                  </div>
                  <p className="font-light text-red-500 opacity-100">You can't change this title</p>
                  <div className="relative mt-4">
                    <label htmlFor="description" className="">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="w-full h-20 bg-transparent focus:outline-none focus:border-black border-b-2 border-gray-400 resize-none"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="relative mt-4">
                    <textarea
                      id="content"
                      name="content"
                      className="hidden"
                      value={text}
                      required
                    />
                    <label htmlFor="content">
                      <MdEditor
                        modelValue={text}
                        onChange={setText}
                        theme={theme}
                        language="en-US"
                        showCodeRowNumber={true}
                        preview={false}
                        showToolbarName={false}
                        noMermaid={true}
                        onUploadImg={handleUploadImage}
                        toolbarsExclude={[
                          'github',
                          'catalog',
                          'htmlPreview',
                          'fullscreen',
                          'mermaid',
                          'save',
                        ]}
                      />
                    </label>
                  </div>

                  <div
                    className={`mt-4 ${text?.length && previewThumb?.length && !submited ? 'bg-green-400 cursor-pointer dark:bg-green-700' : 'bg-green-100 cursor-none text-gray-200 dark:text-gray-100/50 dark:bg-green-700/50'} p-2 rounded-lg transition-all`}
                  >
                    <button
                      disabled={!(text?.length && previewThumb?.length && !submited)}
                      type="submit"
                      className="w-full"
                    >
                      PUBLISH
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <p>Fetching Content</p>
      )}
    </>
  );
}
