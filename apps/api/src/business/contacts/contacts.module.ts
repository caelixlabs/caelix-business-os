import { Module } from "@nestjs/common";

import { CONTACT_REPOSITORY } from "./domain/repositories";

import { ContactPrismaRepository } from "./infrastructure/prisma/contact.prisma.repository";

import { CreateContactUseCase } from "./application/create-contact/create-contact.use-case";
import { GetContactHandler } from "./application/get-contact/get-contact.handler";
import { ListContactsHandler } from "./application/list-contacts/list-contacts.handler";
import { UpdateContactHandler } from "./application/update-contact/update-contact.handler";
import { ArchiveContactHandler } from "./application/archive-contact/archive-contact.handler";
import { ActivateContactHandler } from "./application/activate-contact/activate-contact.handler";
import { ContactController } from "./presentation/controllers/contact.controller";

@Module({
  controllers: [ContactController],

  providers: [
    {
      provide: CONTACT_REPOSITORY,
      useClass: ContactPrismaRepository,
    },

    CreateContactUseCase,
    GetContactHandler,
    ListContactsHandler,
    UpdateContactHandler,
    ArchiveContactHandler,
    ActivateContactHandler,
  ],

  exports: [
    CONTACT_REPOSITORY,
    CreateContactUseCase,
    GetContactHandler,
    ListContactsHandler,
    UpdateContactHandler,
    ArchiveContactHandler,
    ActivateContactHandler,
  ],
})
export class ContactsModule {}
