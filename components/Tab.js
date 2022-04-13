// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Tab } from '@headlessui/react';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
export function TabGroup({ children }) {
  return (
    <Tab.Group>
      <Tab.List className='mb-2 pb-2 overflow-x-auto flex'>
        {children.map((el, i) => (
          <Tab
            key={`tab_${el.props.name}`}
            className={({ selected }) =>
              classNames(
                `px-2 mx-1 mt-2 text-md w-auto hover:border-opacity-100 hover:text-blue-500 hover:border-b-2 hover:border-blue-500 hover:transition-all hover:duration-500`,
                selected
                  ? `border-blue-500 border-opacity-100 text-blue-500 border-b-2 transition-all duration-500`
                  : `border-gray-500 border-b-2 border-opacity-50 transition-all duration-500`
              )
            }
          >
            {el.props.name}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels>
        {children.map((el, i) => (
          <Tab.Panel key={`panel_${el.props.name}`}>{el.props.children}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
export function TabContent({ children }) {
  return <>{children}</>;
}
