import Image from 'next/image';
import Link from 'next/link';

export default function Card({ href, title, description, date, thumbnail }) {
  return (
    <Link className="cursor-pointer" href={`/blog/${href}`}>
      <Image
        src={thumbnail}
        width={0}
        height={0}
        quality={75}
        sizes="fit"
        className="w-full rounded-b-none rounded-t-lg"
        alt={`Thumbnail ${title}`}
      />
      <div className="w-full bg-gray-200 dark:bg-gray-900 p-4 rounded-b-lg">
        <h1 className="font-extrabold text-2xl md:text-3xl lg:text-4xl">{title}</h1>
        <p className="font-light">{date}</p>
        <p className="my-1 text-md md:text-lg lg:text-xl">{description}</p>
      </div>
    </Link>
  );
}
