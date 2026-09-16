import type { Contact, GymMember } from "@caelix-business-os/database";

type GymMemberWithContact = GymMember & { contact: Contact };

export class GymMemberResponseDto {
  id!: string;
  contactId!: string;
  branchId?: string;
  memberNo!: string;
  firstName!: string;
  lastName!: string;
  email?: string;
  phone?: string;
  status!: string;
  joinedAt!: Date;
  notes?: string;

  static fromDomain(member: GymMemberWithContact): GymMemberResponseDto {
    const dto = new GymMemberResponseDto();
    dto.id = member.id;
    dto.contactId = member.contactId;
    dto.branchId = member.branchId ?? undefined;
    dto.memberNo = member.memberNo;
    dto.firstName = member.contact.firstName ?? "";
    dto.lastName = member.contact.lastName ?? "";
    dto.email = member.contact.email ?? undefined;
    dto.phone = member.contact.phone ?? undefined;
    dto.status = member.status;
    dto.joinedAt = member.joinedAt;
    dto.notes = member.notes ?? undefined;
    return dto;
  }

  static fromDomainList(members: GymMemberWithContact[]): GymMemberResponseDto[] {
    return members.map((member) => GymMemberResponseDto.fromDomain(member));
  }
}
