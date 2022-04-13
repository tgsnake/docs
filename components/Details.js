// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Disclosure } from '@headlessui/react';
export function Details({ summary, children }) {
  return <>{children}</>;
}
export function DetailsGroups({ children }) {
  return (
    <div className='m-2 p-2 rounded-lg shadow-md'>
      <Disclosure>
        {children.map((el, i) => (
          <>
            <Disclosure.Button
              key={`button_${i}`}
              className='bg-blue-100 flex rounded-lg p-2 font-medium hover:bg-blue-200 text-blue-500 mb-2 justify-between text-left focus:outline-none focus:ring focus:ring-blue-200 focus:ring-opacity-75'
            >
              {el.props.summary}
            </Disclosure.Button>
            <Disclosure.Panel key={`panel_${i}`}>{el.props.children}</Disclosure.Panel>
          </>
        ))}
      </Disclosure>
    </div>
  );
}
