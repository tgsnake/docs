import { useData } from 'nextra/data';
import { useState, createElement, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export const TableData = () => {
  const router = useRouter();
  const params = useParams();
  // Get the data from SSG, and render it as a component.
  const { list } = useData();
  const [filter, setFilter] = useState(/.*/gim);
  const checkArray = (array) => {
    for (const el of array) {
      if (filter.test(el)) return true;
    }
    return false;
  };
  const setValue = (e) => {
    if (e.target.value === '') {
      router.push('#');
    } else {
      router.push(`#${encodeURIComponent(e.target.value)}`);
    }
  };
  useEffect(() => {
    const hash =
      typeof window !== 'undefined'
        ? decodeURIComponent(window.location.hash.replace('#', '')).trim()
        : undefined;
    if (hash && hash !== '') {
      setFilter(new RegExp(hash, 'gim'));
    } else {
      setFilter(/.*/gim);
    }
  }, [params]);
  return (
    <div className="mt-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Looking for something?..."
          className="w-full bg-gray-100 rounded-lg p-2 dark:bg-gray-700"
          onChange={setValue}
        />
      </div>
      <div>
        <table className="nx-block nx-overflow-x-scroll nextra-scrollbar nx-mt-6 nx-p-0 first:nx-mt-0 table-fixed">
          <thead>
            <tr className="nx-m-0 nx-border-t nx-border-gray-300 nx-p-0 dark:nx-border-gray-600 even:nx-bg-gray-100 even:dark:nx-bg-gray-600/20">
              <th
                className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
                align="center"
              >
                Code
              </th>
              <th
                className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
                align="center"
              >
                Message
              </th>
              <th
                className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
                align="center"
              >
                Description
              </th>
              <th
                className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600"
                align="center"
              >
                Possible Error In
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((el, i) => {
              if (
                filter.test(String(el.code)) ||
                filter.test(el.msg) ||
                filter.test(el.desc) ||
                checkArray(el.affected)
              ) {
                return (
                  <tr
                    className="nx-m-0 nx-border-t nx-border-gray-300 nx-p-0 dark:nx-border-gray-600 even:nx-bg-gray-100 even:dark:nx-bg-gray-600/20"
                    key={i}
                  >
                    <td
                      className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 dark:nx-border-gray-600"
                      align="center"
                    >
                      <code
                        className="nx-border-black nx-border-opacity-[0.04] nx-bg-opacity-[0.03] nx-bg-black nx-break-words nx-rounded-md nx-border nx-py-0.5 nx-px-[.25em] nx-text-[.9em] dark:nx-border-white/10 dark:nx-bg-white/10"
                        dir="ltr"
                      >
                        {el.code}
                      </code>
                    </td>
                    <td
                      className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 dark:nx-border-gray-600"
                      align="center"
                    >
                      <code
                        className="nx-border-black nx-border-opacity-[0.04] nx-bg-opacity-[0.03] nx-bg-black nx-break-words nx-rounded-md nx-border nx-py-0.5 nx-px-[.25em] nx-text-[.9em] dark:nx-border-white/10 dark:nx-bg-white/10"
                        dir="ltr"
                      >
                        {el.msg}
                      </code>
                    </td>
                    <td
                      className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 dark:nx-border-gray-600"
                      align="left"
                    >
                      {createElement('span', {
                        dangerouslySetInnerHTML: {
                          __html: el.desc
                            .replace(
                              /\[([^\[\]]*)\]\((.*?)\)/gm,
                              (match, text, href) =>
                                `<a href="${href}" target="_blank" rel="noreferrer" class="nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]">${text}</a>`,
                            )
                            .replace(
                              /\`([^\`].*?)\`/gm,
                              (match, text) =>
                                `<code class="nx-border-black nx-border-opacity-[0.04] nx-bg-opacity-[0.03] nx-bg-black nx-break-words nx-rounded-md nx-border nx-py-0.5 nx-px-[.25em] nx-text-[.9em] dark:nx-border-white/10 dark:nx-bg-white/10" dir="ltr">${text}</code>`,
                            ),
                        },
                        suppressHydrationWarning: true,
                      })}
                    </td>
                    <td
                      className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 dark:nx-border-gray-600"
                      align="left"
                    >
                      <ul>
                        {el.affected.map((af, ia) => (
                          <li key={ia}>
                            <code
                              className="nx-border-black nx-border-opacity-[0.04] nx-bg-opacity-[0.03] nx-bg-black nx-break-words nx-rounded-md nx-border nx-py-0.5 nx-px-[.25em] nx-text-[.9em] dark:nx-border-white/10 dark:nx-bg-white/10"
                              dir="ltr"
                            >
                              Raw.{af}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
