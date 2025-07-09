import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientEntity } from './entities/patient.entity';
import { Gender } from '../common/constants/enums';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createPatientDto: CreatePatientDto): Promise<PatientEntity> {
    const patient = await this.prisma.patient.create({
      data: {
        ...createPatientDto,
        userId,
        birthday: new Date(createPatientDto.birthday),
      },
    });

    return new PatientEntity({
      ...patient,
      gender: patient.gender as Gender,
    });
  }

  async findAll(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where: { userId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            select: {
              id: true,
              orderNo: true,
              status: true,
              totalAmount: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      }),
      this.prisma.patient.count({ where: { userId, deletedAt: null } }),
    ]);

    const patientEntities = patients.map(patient => new PatientEntity({
      ...patient,
      gender: patient.gender as Gender,
    }));

    return {
      data: patientEntities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, userId: number): Promise<PatientEntity> {
    const patient = await this.prisma.patient.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        orders: {
          include: {
            items: true,
            payments: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        medicalRecords: {
          orderBy: { visitDate: 'desc' },
          take: 10,
        },
      },
    });

    if (!patient) {
      throw new NotFoundException('就诊人不存在');
    }

    return new PatientEntity({
      ...patient,
      gender: patient.gender as Gender,
    });
  }

  async update(id: number, userId: number, updatePatientDto: UpdatePatientDto, updatedBy?: number): Promise<PatientEntity> {
    // 验证就诊人是否属于当前用户
    const existingPatient = await this.prisma.patient.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!existingPatient) {
      throw new NotFoundException('就诊人不存在');
    }

    const updateData: any = { ...updatePatientDto };
    if (updatePatientDto.birthday) {
      updateData.birthday = new Date(updatePatientDto.birthday).toISOString();
    }
    if (updatedBy) {
      updateData.updatedBy = updatedBy;
    }

    const patient = await this.prisma.patient.update({
      where: { id },
      data: updateData,
    });

    return new PatientEntity({
      ...patient,
      gender: patient.gender as Gender,
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    // 验证就诊人是否属于当前用户
    const patient = await this.prisma.patient.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!patient) {
      throw new NotFoundException('就诊人不存在');
    }

    // 检查是否有关联的订单
    const orderCount = await this.prisma.order.count({
      where: { patientId: id, deletedAt: null },
    });

    if (orderCount > 0) {
      throw new ForbiddenException('该就诊人存在关联订单，无法删除');
    }

    // 软删除：更新 deletedAt 字段
    await this.prisma.patient.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStatistics(userId: number) {
    const [totalPatients, maleCount, femaleCount, recentPatients] = await Promise.all([
      this.prisma.patient.count({ where: { userId, deletedAt: null } }),
      this.prisma.patient.count({ where: { userId, gender: 'MALE', deletedAt: null } }),
      this.prisma.patient.count({ where: { userId, gender: 'FEMALE', deletedAt: null } }),
      this.prisma.patient.count({
        where: {
          userId,
          deletedAt: null,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 最近30天
          },
        },
      }),
    ]);

    return {
      totalPatients,
      maleCount,
      femaleCount,
      otherCount: totalPatients - maleCount - femaleCount,
      recentPatients,
    };
  }
}