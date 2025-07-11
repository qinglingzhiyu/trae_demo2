'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import '../styles/nprogress.css';

// 配置 NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 200,
});

const ProgressBar = () => {
  const pathname = usePathname();

  useEffect(() => {
    // 路由变化时启动进度条
    NProgress.start();
    
    // 模拟加载完成
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
};

export default ProgressBar;