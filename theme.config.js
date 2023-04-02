import { useRouter } from 'next/router'
import { useConfig } from 'nextra-theme-docs' 
import { useEffect, useState } from 'react'
import Image from "next/image"

export default {
  project : {
    link : 'https://github.com/tgsnake'
  },
  logo : <span className="font-extrabold text-lg">tgsnake</span>,
  docsRepositoryBase: 'https://github.com/tgsnake/docs/tree/master/pages',
  useNextSeoProps : () => {
    const { asPath } = useRouter()
    if(asPath !== '/'){
      return {
        titleTemplate : '%s - tgsnake'
      }
    }
  },
  head : () => { 
    const { title } = useConfig() 
    const { route } = useRouter() 
    const socialCard = `http://localhost:3000/api/og?title=${title ?? ''}`
    return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
      <meta name="robots" content="follow, index" /> 
      <meta name="description" content="Telegram MTProto framework for typescript or javascript."/> 
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="tgsnake documentation"/>
      <meta property="og:description" content="Telegram MTProto framework for typescript or javascript." />
      <meta property="og:image" content={socialCard} key="https://tgsnake.js.org/images/tgsnake.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="tgsnake.js.org" />
      <meta name="twitter:description" content="Telegram MTProto framework for typescript or javascript." />
      <meta name="twitter:image" content={socialCard} />
      <meta name="article:author" content="tgsnake"/>
    </>
  ) },
  darkMode : true,
  search : {
    placeholder : 'Looking for something?...',
    error : 'Oops! My snake is lost...',
    loading : 'Finding a snake...'
  },
  sidebar : {
    toggleButton : true
  },
  editLink : {
    text : <span>Edit this page</span>
  },
  footer : {
    text: <p>MIT {new Date().getFullYear()} © butthx.</p>
  }
}