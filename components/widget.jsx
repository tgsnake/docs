'use client';
import { LoginButton } from '@telegram-auth/react';

export default function Widget() {
  async function callApiWhenAuth(data) {
    await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return (
    <>
      <LoginButton
        botUsername="tgsnakerobot"
        onAuthCallback={callApiWhenAuth}
        buttonSize="medium"
        cornerRadius={5}
        showAvatar={true}
        lang="en"
      />
    </>
  );
}
