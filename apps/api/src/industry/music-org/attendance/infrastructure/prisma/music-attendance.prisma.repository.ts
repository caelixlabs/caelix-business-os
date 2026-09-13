import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/common/prisma';
import { MusicAttendanceStatus as PrismaMusicAttendanceStatus } from '@caelix-business-os/database';
import { MusicAttendance } from '../../domain/entities/music-attendance.entity';
import { MusicAttendanceRepository } from '../../domain/repositories/music-attendance.repository';
import { MusicAttendanceStatus } from '../../domain/enums/music-attendance.enum';

@Injectable()
export class MusicAttendancePrismaRepository
    implements MusicAttendanceRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async upsert(
        attendance: MusicAttendance,
    ): Promise<MusicAttendance> {
        await this.prisma.client.musicAttendance.upsert({
            where: {
                studentId_batchId_date: {
                    studentId: attendance.studentId,
                    batchId: attendance.batchId,
                    date: attendance.date,
                },
            },

            create: {
                id: attendance.id,
                organizationId: attendance.organizationId,
                studentId: attendance.studentId,
                batchId: attendance.batchId,
                date: attendance.date,

                status:
                    attendance.status as PrismaMusicAttendanceStatus,

                notes: attendance.notes,
            },

            update: {
                status:
                    attendance.status as PrismaMusicAttendanceStatus,

                notes: attendance.notes,
            },
        });

        return attendance;
    }

    async findByBatch(
        organizationId: string,
        batchId: string,
        date: Date,
    ): Promise<MusicAttendance[]> {
        const rows =
            await this.prisma.client.musicAttendance.findMany({
                where: {
                    organizationId,
                    batchId,
                    date,
                },
            });

        return rows.map((row) => this.toDomain(row));
    }

    async findByStudent(
        organizationId: string,
        studentId: string,
    ): Promise<MusicAttendance[]> {
        const rows =
            await this.prisma.client.musicAttendance.findMany({
                where: {
                    organizationId,
                    studentId,
                },
                orderBy: {
                    date: "desc",
                },
            });

        return rows.map((row) => this.toDomain(row));
    }

    private toDomain(row: {
        id: string;
        organizationId: string;
        studentId: string;
        batchId: string;
        date: Date;
        status: string;
        notes: string | null;
    }): MusicAttendance {
        return MusicAttendance.create({
            id: row.id,
            organizationId: row.organizationId,
            studentId: row.studentId,
            batchId: row.batchId,
            date: row.date,

            status:
                row.status as MusicAttendanceStatus,

            notes: row.notes ?? undefined,
        });
    }
}