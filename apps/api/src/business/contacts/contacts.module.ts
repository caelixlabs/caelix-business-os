import { Module } from "@nestjs/common";

import { CONTACT_REPOSITORY } from "./domain/repositories";

import { ContactPrismaRepository } from "./infrastructure/prisma/contact.prisma.repository";

import { CreateContactUseCase } from "./application/create-contact/create-contact.use-case";

@Module({
  providers: [
    {
      provide: CONTACT_REPOSITORY,
      useClass: ContactPrismaRepository,
    },

    CreateContactUseCase,
  ],

  exports: [CONTACT_REPOSITORY, CreateContactUseCase],
})
export class ContactsModule {}
