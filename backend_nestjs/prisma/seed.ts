import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 创建默认管理员账号
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { phone: '13800138000' },
    update: {},
    create: {
      name: '系统管理员',
      phone: '13800138000',
      email: 'admin@medicrm.com',
      idCard: '110101199001011234',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ 默认管理员账号创建成功:', admin);
  console.log('📱 手机号: 13800138000');
  console.log('🔑 密码: admin123');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据创建失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });