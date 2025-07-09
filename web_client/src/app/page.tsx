'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { storage } from '@/utils';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 检查是否已登录
    const token = storage.get('token');
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Spin size="large" />
    </div>
  );
}
