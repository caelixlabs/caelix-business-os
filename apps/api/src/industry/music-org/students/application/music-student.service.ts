import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { customUUID } from "@/kernel/utility/uuid";
import { MusicStudent } from "../domain/entities/music-student.entity";
import type { MusicStudentRepository } from "../domain/repositories/music-student.repository";
import { MusicSkillLevel } from "../../courses/domain/enums/music-skill.enum";
import { MusicStudentStatus } from "../domain/enums/music-student.enum";
import { MUSIC_STUDENT_REPOSITORY } from "../domain/repositories/music-student.token";

export interface CreateMusicStudentInput {
    studentNo: string;
    firstName: string;
    lastName: string;
    branchId?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: Date;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    instrument?: string;
    skillLevel?: MusicSkillLevel;
    notes?: string;
}

@Injectable()
export class MusicStudentService {
    constructor(
        @Inject(MUSIC_STUDENT_REPOSITORY)
        private readonly repository: MusicStudentRepository,
    ) { }
    // async isStudentNoExists(organizationId: string, studentNo: string) {
    //     const existing = await this.repository.findByOrganization(organizationId);
    //     return existing.some((student) => student.studentNo === studentNo);
    // }

    async create(organizationId: string, input: CreateMusicStudentInput) {
        const existing = await this.repository.findByOrganization(organizationId);

        if (existing.some((student) => student.studentNo === input.studentNo)) {
            throw new ConflictException(
                `Student number '${input.studentNo}' already exists.`
            );
        }

        return this.repository.create(
            MusicStudent.create({
                id: customUUID.generate(),
                organizationId,
                branchId: input.branchId,
                studentNo: input.studentNo,
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email,
                phone: input.phone,
                dateOfBirth: input.dateOfBirth,
                guardianName: input.guardianName,
                guardianPhone: input.guardianPhone,
                guardianEmail: input.guardianEmail,
                instrument: input.instrument,
                skillLevel: input.skillLevel ?? MusicSkillLevel.BEGINNER,
                status: MusicStudentStatus.ACTIVE,
                joinedAt: new Date(),
                notes: input.notes,
            })
        );
    }

    list(organizationId: string) {
        return this.repository.findByOrganization(organizationId);
    }

    async get(organizationId: string, id: string) {
        const student = await this.repository.findById(id, organizationId);

        if (!student) {
            throw new NotFoundException("Music student not found.");
        }

        return student;
    }
}
