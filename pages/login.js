// Tgsnake - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Butthx <https://github.com/butthx>
//
// This file is part of Tgsnake
//
// Tgsnake is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { TelegramClient } from 'telegram';
import { StringSession, StoreSession } from 'telegram/sessions';
import { useState, useEffect } from 'react';
function SvgClipboard() {
  return (
    <svg
      className='h-6 w-6 text-center'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
      />
    </svg>
  );
}
export default function Home() {
  const [apiId, setApiId] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [otp, setOtp] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [twoFAPass, setTwoFAPass] = useState('');
  const [ask, setAsk] = useState(false);
  const [error, setError] = useState('');
  const [login, setLogin] = useState(false);
  const [loginAs, setLoginAs] = useState('');
  const [session, setSession] = useState('');
  const [progress, setProgress] = useState('');
  const runLogin = async () => {
    try {
      if (login && !ask) {
        let _client = new TelegramClient(new StringSession(''), Number(apiId), String(apiHash), {
          connectionRetries: 5,
        });
        _client.setLogLevel('debug');
        if (loginAs == 'bot') {
          await _client.start({
            botAuthToken: () => {
              setAsk('botToken');
              setProgress('waiting bot token');
              return new Promise((resolve, reject) => {
                let btn = document.getElementById('submit');
                btn.addEventListener('click', (e) => {
                  e.preventDefault();
                  setProgress('Verifying bot token.');
                  let botTokenDomValue = document.getElementById('bottoken')
                    ? document.getElementById('bottoken').value
                    : botToken;
                  if (botToken !== '' || botTokenDomValue !== '') {
                    setProgress('resolve botToken');
                    resolve(botToken == '' ? botTokenDomValue : botToken);
                  } else {
                    setProgress('');
                    setError('botToken cannot be empty or undefined.');
                  }
                });
              });
            },
          });
          setProgress('generating session');
          setSession(await _client.session.save());
          setProgress('');
          setAsk(false);
          setLoginAs('');
          setBotToken('');
          setLogin(false);
          return true;
        } else if (loginAs == 'user') {
          await _client.start({
            phoneNumber: () => {
              setAsk('phoneNumber');
              setProgress('waiting phone number.');
              return new Promise((resolve) => {
                let btn = document.getElementById('submit');
                btn.addEventListener('click', (e) => {
                  e.preventDefault();
                  let phoneNumberDomValue = document.getElementById('phonenumber')
                    ? document.getElementById('phonenumber').value
                    : phoneNumber;
                  if (phoneNumber !== '' || phoneNumberDomValue !== '') {
                    setProgress('resolve phone number');
                    resolve(phoneNumber == '' ? phoneNumberDomValue : phoneNumber);
                  } else {
                    setProgress('');
                    setError('phoneNumber cannot be empty or undefined.');
                  }
                });
              });
            },
            password: () => {
              setAsk('password');
              setProgress('waiting password.');
              return new Promise((resolve) => {
                let btn = document.getElementById('submit');
                btn.addEventListener('click', (e) => {
                  e.preventDefault();
                  let passwordDomValue = document.getElementById('password')
                    ? document.getElementById('password').value
                    : twoFAPass;
                  if (twoFAPass !== '' || passwordDomValue !== '') {
                    setProgress('resolve password');
                    resolve(twoFAPass == '' ? passwordDomValue : twoFAPass);
                  } else {
                    setProgress('');
                    setError('password cannot be empty or undefined.');
                  }
                });
              });
            },
            phoneCode: () => {
              setAsk('phoneCode');
              setProgress('waiting phone code.');
              return new Promise((resolve) => {
                let btn = document.getElementById('submit');
                btn.addEventListener('click', (e) => {
                  e.preventDefault();
                  let otpDomValue = document.getElementById('phonecode')
                    ? document.getElementById('phonecode').value
                    : otp;
                  if (otp !== '' || otpDomValue !== '') {
                    setProgress('resolve otp');
                    resolve(otp == '' ? otpDomValue : otp);
                  } else {
                    setProgress('');
                    setError('cannot be empty or undefined.');
                  }
                });
              });
            },
            onError: (error) => {
              setLogin(false);
              setError(error.message);
              setProgress('');
            },
          });
          if(_client.session){
            setProgress('generating session');
            setSession(await _client.session.save());
          }
          setAsk(false);
          setLoginAs('');
          setLogin(false);
          setProgress('');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log(error);
      setError(error.message);
      setProgress('');
    }
  };
  const generateQuestion = () => {
    switch (ask) {
      case 'botToken':
        return (
          <div className='flex items-center justify-between mt-2'>
            <input
              name='bottoken'
              className='m-2 p-2 w-5/6 border border-[#769FCD] rounded-lg focus:outline-none focus:ring focus:ring-[#769FCD]/50'
              type='text'
              placeholder='BOT TOKEN'
              required
              id='bottoken'
              value={botToken}
              onChange={(e) => {
                setError('');
                if (ask && !login) setLogin(true);
                if (!login) return false;
                setBotToken(e.target.value);
              }}
            />
            <button
              className='p-2 h-10 items-center text-center text-white w-10 mx-2 rounded-lg bg-[#769FCD] focus:ring focus:ring-[#769FCD]/50 focus:outline-none hover:bg-sky-600 focus:bg-[#769FCD]'
              onClick={async (e) => {
                e.preventDefault();
                setError('');
                if (ask && !login) setLogin(true);
                if (!login) return false;
                setBotToken(await navigator.clipboard.readText());
              }}
            >
              <SvgClipboard />
            </button>
          </div>
        );
        break;
      case 'phoneNumber':
        return (
          <div className='flex items-center justify-between mt-2'>
            <input
              name='phonenumber'
              className='m-2 p-2 w-5/6 border border-[#769FCD] rounded-lg focus:outline-none focus:ring focus:ring-[#769FCD]/50'
              type='text'
              placeholder='INTERNATIONAL PHONE NUMBER'
              required
              id='phonenumber'
              value={phoneNumber}
              onChange={(e) => {
                setError('');
                if (ask && !login) setLogin(true);
                if (!login) return false;
                setPhoneNumber(e.target.value);
              }}
            />
            <button
              className='p-2 h-10 items-center text-center text-white w-10 mx-2 rounded-lg bg-[#769FCD] focus:ring focus:ring-[#769FCD]/50 focus:outline-none hover:bg-sky-600 focus:bg-[#769FCD]'
              onClick={async (e) => {
                e.preventDefault();
                setError('');
                if (ask && !login) setLogin(true);
                if (!login) return false;
                setPhoneNumber(await navigator.clipboard.readText());
              }}
            >
              <SvgClipboard />
            </button>
          </div>
        );
        break;
      case 'phoneCode':
        return (
          <div className='flex items-center justify-between mt-2'>
            <input
              name='phonecode'
              className='m-2 p-2 w-5/6 border border-[#769FCD] rounded-lg focus:outline-none focus:ring focus:ring-[#769FCD]/50'
              type='text'
              placeholder='OTP'
              required
              id='phonecode'
              value={otp}
              onChange={(e) => {
                setError('');
                if (ask && !login) setLogin(true);
                if (!login) return false;
                setOtp(e.target.value);
              }}
            />
            <button
              className='p-2 h-10 items-center text-center text-white w-10 mx-2 rounded-lg bg-[#769FCD] focus:ring focus:ring-[#769FCD]/50 focus:outline-none hover:bg-sky-600 focus:bg-[#769FCD]'
              onClick={async (e) => {
                e.preventDefault();
                setError('');
                if (ask && !login) setLogin(true);
                if (!login) return false;
                setOtp(await navigator.clipboard.readText());
              }}
            >
              <SvgClipboard />
            </button>
          </div>
        );
        break;
      case 'password':
        return (
          <div className='flex items-center justify-between mt-2'>
            <input
              name='password'
              className='m-2 p-2 w-5/6 border border-[#769FCD] rounded-lg focus:outline-none focus:ring focus:ring-[#769FCD]/50'
              type='text'
              placeholder='2FA PASSWORD'
              required
              id='password'
              value={twoFAPass}
              onChange={(e) => {
                setError('');
                if (ask && !login) setLogin(true);
                if (!login) return false;
                setTwoFAPass(e.target.value);
              }}
            />
            <button
              className='p-2 h-10 items-center text-center text-white w-10 mx-2 rounded-lg bg-[#769FCD] focus:ring focus:ring-[#769FCD]/50 focus:outline-none hover:bg-sky-600 focus:bg-[#769FCD]'
              onClick={async (e) => {
                e.preventDefault();
                setError('');
                if (ask && !login) setLogin(true);
                if (!login) return false;
                setTwoFAPass(await navigator.clipboard.readText());
              }}
            >
              <SvgClipboard />
            </button>
          </div>
        );
        break;
      default:
        return <></>;
    }
  };
  useEffect(() => {
    runLogin();
  }, [login]);
  return (
    <div className='relative'>
      <div className='h-screen w-full bg-[#D6E6F2]'>
        <div className='inset-x-0 md:inset-x-48 top-10 mx-1 rounded-b-xl absolute bg-white rounded-t-xl p-2'>
          <div className='flex justify-center'>
            <div className='border-b-2 border-gray-200 w-16 h-2'></div>
          </div>
          <div className='my-2'>
            <h2 className='text-black font-bold text-xl text-center'>tgsnake session generator</h2>
            <div className='flex justify-between mt-2 items-center'>
              <input
                name='apiid'
                className='m-2 p-2 w-5/6 border border-[#769FCD] rounded-lg focus:outline-none focus:ring focus:ring-[#769FCD]/50'
                type='text'
                required
                placeholder='API ID'
                value={apiId}
                onChange={(e) => {
                  if (login) return false;
                  setApiId(e.target.value);
                }}
              />
              <button
                className='p-2 h-10 items-center text-center text-white w-10 mx-2 rounded-lg bg-[#769FCD] focus:ring focus:ring-[#769FCD]/50 focus:outline-none hover:bg-[#769FCD] focus:bg-[#769FCD]'
                onClick={async (e) => {
                  e.preventDefault();
                  if (login) return false;
                  setApiId(await navigator.clipboard.readText());
                }}
              >
                <SvgClipboard />
              </button>
            </div>
            <div className='flex justify-between mt-2 items-center'>
              <input
                name='apihash'
                className='m-2 p-2 w-5/6 border border-[#769FCD] rounded-lg focus:outline-none focus:ring focus:ring-[#769FCD]/50'
                type='text'
                required
                placeholder='API HASH'
                value={apiHash}
                onChange={(e) => {
                  if (login) return false;
                  setApiHash(e.target.value);
                }}
              />
              <button
                className='p-2 h-10 items-center text-center text-white w-10 mx-2 rounded-lg bg-[#769FCD] focus:ring focus:ring-[#769FCD]/50 focus:outline-none hover:bg-sky-600 focus:bg-[#769FCD]'
                onClick={async (e) => {
                  e.preventDefault();
                  if (login) return false;
                  setApiHash(await navigator.clipboard.readText());
                }}
              >
                <SvgClipboard />
              </button>
            </div>
            <div className='flex justify-center items-center'>
              <div className='border-b-2 border-gray-200 w-16 h-2'></div>
              <span className='p-2 mx-2 font-light'>login as</span>
              <div className='border-b-2 border-gray-200 w-16 h-2'></div>
            </div>
            <div className='flex items-center justify-between mt-2'>
              <button
                className='w-3/6 p-2 rounded-lg bg-[#769FCD] hover:bg-[#769FCD] focus:bg-[#769FCD] text-white focus:ring focus:ring-[#769FCD]/50 focus:outline-none text-center mx-2 '
                onClick={async (e) => {
                  e.preventDefault();
                  setError('');
                  if (login) return setError('already logined as bot.');
                  if (apiHash == '' || apiId == '')
                    return setError('Api ID or Hash cannot be empty or undefined.');
                  setProgress('trying login as bot');
                  setLoginAs('bot');
                  setLogin(true);
                }}
              >
                Bot
              </button>
              <button
                className='w-3/6 p-2 rounded-lg bg-[#769FCD] hover:bg-[#769FCD] focus:bg-[#769FCD] text-white focus:ring focus:ring-[#769FCD]/50 focus:outline-none text-center mx-2 '
                onClick={async (e) => {
                  e.preventDefault();
                  setError('');
                  if (login) return setError('already logined as user.');
                  if (apiHash == '' || apiId == '')
                    return setError('Api ID or Hash cannot be empty or undefined.');
                  setProgress('trying login as user');
                  setLoginAs('user');
                  setLogin(true);
                }}
              >
                User
              </button>
            </div>
            <div className='mx-2 mt-3'>
              <p className='text-red-500 font-light px-2'>
                {error !== '' ? `[Error] ${error}` : error}
              </p>
              <p className='text-black font-light px-2'>
                {progress !== '' ? `[PleaseWait] ${progress}` : progress}
              </p>
            </div>
            <div></div>
            {generateQuestion()}
            <div>
              {ask ? (
                <div className='mt-3'>
                  <button
                    id='submit'
                    className='w-[96%] p-2 rounded-lg bg-[#769FCD] hover:bg-[#769FCD] focus:bg-[#769FCD] text-white focus:ring focus:ring-[#769FCD]/50 focus:outline-none text-center mx-2 '
                  >
                    Verify
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
            {session !== '' ? (
              <>
                <div className='flex justify-center items-center'>
                  <div className='border-b-2 border-gray-200 w-16 h-2'></div>
                  <span className='p-2 mx-2 font-light'>Your String Session</span>
                  <div className='border-b-2 border-gray-200 w-16 h-2'></div>
                </div>
                <div className='bg-[#769FCD] text-white overflow-y-auto h-62 p-2 rounded-lg break-all'>
                  <code>{session}</code>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <p className='text-center my-2 py-2 text-black'>{`MIT ${new Date().getFullYear()} © butthx.`}</p>
        </div>
      </div>
    </div>
  );
}
