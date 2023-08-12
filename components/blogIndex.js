import { getPagesUnderRoute } from 'nextra/context';
import filterRouteLocale from 'nextra/filter-route-locale';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function BlogIndex() {
  const { locale, defaultLocale } = useRouter();
  return filterRouteLocale(getPagesUnderRoute('/blog'), locale, defaultLocale).map((page) => {
    return (
      <Link href={page.route} key={page.route}>
        <div className="my-4 p-4 dark:bg-neutral-800 bg-neutral-100 rounded-xl block cursor-pointer">
          <div className="mb-2">
            {page.frontMatter?.banner ? (
              <Image src={page.frontMatter.banner} width={1080} height={720} alt="banner" />
            ) : (
              <Image src="/images/tgsnake.jpg" width={1080} height={720} alt="banner" />
            )}
          </div>
          {page.frontMatter?.date ? <p className="font-light"> {page.frontMatter.date} </p> : null}
          <p className="my-2 font-bold text-2xl">
            {page.meta?.title || page.frontMatter?.title || page.name}
          </p>
          <p>{page.frontMatter?.description}</p>
        </div>
      </Link>
    );
  });
}
