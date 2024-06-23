import { useData } from 'nextra/hooks';
import { useState, createElement, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export const TableData = ({ showAffected, onlyShow, showSearch }) => {
  const router = useRouter();
  const params = useParams();
  // Get the data from SSG, and render it as a component.
  const { list } = useData();
  const [filter, setFilter] = useState(onlyShow || /.*/gim);
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
      setFilter(onlyShow || /.*/gim);
    }
  }, [params]);
  return (
    <div className="mt-4">
      {showSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Looking for something?..."
            className="w-full bg-gray-100 rounded-lg p-2 dark:bg-gray-700"
            onChange={setValue}
          />
        </div>
      )}
      <div>
        <table className="_block _overflow-x-auto nextra-scrollbar _mt-6 _p-0 first:_mt-0 table-fixed">
          <thead>
            <tr className="_m-0 _border-t _border-gray-300 _p-0 dark:_border-gray-600 even:_bg-gray-100 even:dark:_bg-gray-600/20">
              <th
                className="_m-0 _border _border-gray-300 _px-4 _py-2 _font-semibold dark:_border-gray-600"
                align="center"
              >
                Code
              </th>
              <th
                className="_m-0 _border _border-gray-300 _px-4 _py-2 _font-semibold dark:_border-gray-600"
                align="center"
              >
                Message
              </th>
              <th
                className="_m-0 _border _border-gray-300 _px-4 _py-2 _font-semibold dark:_border-gray-600"
                align="center"
              >
                Description
              </th>
              {showAffected && (
                <th
                  className="_m-0 _border _border-gray-300 _px-4 _py-2 _font-semibold dark:_border-gray-600"
                  align="center"
                >
                  Possible Error In
                </th>
              )}
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
                    className="_m-0 _border-t _border-gray-300 _p-0 dark:_border-gray-600 even:_bg-gray-100 even:dark:_bg-gray-600/20"
                    key={i}
                  >
                    <td
                      className="_m-0 _border _border-gray-300 _px-4 _py-2 dark:_border-gray-600"
                      align="center"
                    >
                      <code className="nextra-code" dir="ltr">
                        {el.code}
                      </code>
                    </td>
                    <td
                      className="_m-0 _border _border-gray-300 _px-4 _py-2 dark:_border-gray-600"
                      align="center"
                    >
                      <code className="nextra-code" dir="ltr">
                        {el.msg}
                      </code>
                    </td>
                    <td
                      className="_m-0 _border _border-gray-300 _px-4 _py-2 dark:_border-gray-600"
                      align="left"
                    >
                      {createElement('span', {
                        dangerouslySetInnerHTML: {
                          __html: el.desc
                            .replace(
                              /\[([^\[\]]*)\]\((.*?)\)/gm,
                              (match, text, href) =>
                                `<a href="${href}" target="_blank" rel="noreferrer" class="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]">${text}</a>`,
                            )
                            .replace(
                              /\`([^\`].*?)\`/gm,
                              (match, text) => `<code class="nextra-code" dir="ltr">${text}</code>`,
                            ),
                        },
                        suppressHydrationWarning: true,
                      })}
                    </td>
                    {showAffected && (
                      <td
                        className="_m-0 _border _border-gray-300 _px-4 _py-2 dark:_border-gray-600"
                        align="left"
                      >
                        <ul>
                          {el.affected.map((af, ia) => (
                            <li key={ia}>
                              <code className="nextra-code" dir="ltr">
                                Raw.{af}
                              </code>
                            </li>
                          ))}
                        </ul>
                      </td>
                    )}
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
