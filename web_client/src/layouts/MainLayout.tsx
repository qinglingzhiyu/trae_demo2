'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Space, Breadcrumb } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { storage } from '@/utils';
import { MenuItem } from '@/types';
import ProgressBar from '@/components/ProgressBar';
import NProgress from 'nprogress';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  // 菜单项配置
  const menuItems: MenuItem[] = [
    {
      key: '/dashboard',
      label: '工作台',
      icon: <DashboardOutlined />,
      path: '/dashboard',
    },
    {
      key: '/users',
      label: '用户管理',
      icon: <UserOutlined />,
      path: '/users',
    },
    {
      key: '/patients',
      label: '就诊人管理',
      icon: <TeamOutlined />,
      path: '/patients',
    },
    {
      key: '/orders',
      label: '订单管理',
      icon: <ShoppingCartOutlined />,
      path: '/orders',
    },
    {
      key: '/analytics',
      label: '数据分析',
      icon: <BarChartOutlined />,
      path: '/analytics',
    },
    {
      key: '/settings',
      label: '系统设置',
      icon: <SettingOutlined />,
      children: [
        {
          key: '/settings/permissions',
          label: '权限管理',
          path: '/settings/permissions',
        },
        {
          key: '/settings/parameters',
          label: '系统参数',
          path: '/settings/parameters',
        },
        {
          key: '/settings/dictionary',
          label: '字典管理',
          path: '/settings/dictionary',
        },
        {
          key: '/settings/logs',
          label: '操作日志',
          path: '/settings/logs',
        },
        {
          key: '/settings/notifications',
          label: '消息通知',
          path: '/settings/notifications',
        },
        {
          key: '/settings/personal',
          label: '个人设置',
          path: '/settings/personal',
        },
      ],
    },
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    const menuItem = findMenuItem(menuItems, key);
    if (menuItem?.path) {
      NProgress.start();
      router.push(menuItem.path);
    }
  };

  // 递归查找菜单项
  const findMenuItem = (items: MenuItem[], key: string): MenuItem | null => {
    for (const item of items) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findMenuItem(item.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    return [pathname];
  };

  // 生成面包屑导航
  const getBreadcrumbItems = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbItems: Array<{ title: React.ReactNode; href?: string }> = [
      {
        title: (
          <span>
            <HomeOutlined />
            <span style={{ marginLeft: 4 }}>首页</span>
          </span>
        ),
        href: '/dashboard',
      },
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const menuItem = findMenuItem(menuItems, currentPath);
      
      if (menuItem) {
        breadcrumbItems.push({
          title: <span>{menuItem.label}</span>,
          ...(index === pathSegments.length - 1 ? {} : { href: currentPath }),
        });
      } else {
        // 处理特殊路径
        const segmentMap: Record<string, string> = {
          'dashboard': '工作台',
          'users': '用户管理',
          'patients': '患者管理',
          'orders': '订单管理',
          'analytics': '数据分析',
          'settings': '系统设置',
          'personal': '个人设置',
          'permissions': '权限管理',
          'parameters': '参数配置',
          'dictionary': '字典管理',
          'notifications': '通知设置',
        };
        
        const title = segmentMap[segment] || segment;
        breadcrumbItems.push({
          title: <span>{title}</span>,
          ...(index === pathSegments.length - 1 ? {} : { href: currentPath }),
        });
      }
    });

    return breadcrumbItems;
  };

  // 初始化展开的菜单项
  useEffect(() => {
    if (pathname.startsWith('/settings')) {
      setOpenKeys(['/settings']);
    }
  }, [pathname]);

  // 处理菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      label: '个人信息',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: '个人设置',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        NProgress.start();
        router.push('/profile');
        break;
      case 'settings':
        NProgress.start();
        router.push('/settings/personal');
        break;
      case 'logout':
        NProgress.start();
        storage.remove('token');
        storage.remove('user');
        router.push('/login');
        break;
    }
  };

  return (
    <>
      <ProgressBar />
      <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        style={{
          background: '#001529',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            background: '#002140',
            color: 'white',
          }}
        >
          <MedicineBoxOutlined style={{ fontSize: '20px', color: '#1890FF' }} />
          {!collapsed && (
            <span style={{ marginLeft: 8, fontWeight: 'bold' }}>医疗CRM系统</span>
          )}
        </div>

        {/* 菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        {/* 顶部导航 */}
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Breadcrumb
              items={getBreadcrumbItems()}
              style={{ marginLeft: 16 }}
            />
          </div>

          <Space size="large">
            {/* 通知 */}
            <Badge count={5}>
              <BellOutlined
                style={{
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: '#595959',
                }}
              />
            </Badge>

            {/* 用户信息 */}
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  size="small"
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80"
                />
                <span style={{ color: '#595959' }}>管理员</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区域 */}
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
    </>
  );
};

export default MainLayout;