import { Module } from "@nestjs/common";
import { ENQUIRY_REPOSITORY } from "./domain/repositories";
import { EnquiryPrismaRepository } from "./infrastructure/prisma/enquiry.prisma.repository";
import { CreateEnquiryHandler } from "./application/create-enquiry/create-enquiry.handler";
import { GetEnquiryHandler } from "./application/get-enquiry/get-enquiry.handler";
import { ListEnquiriesHandler } from "./application/list-enquiries/list-enquiries.handler";
import { UpdateEnquiryStatusHandler } from "./application/update-enquiry-status/update-enquiry-status.handler";
import { UpdateEnquiryDetailsHandler } from "./application/update-enquiry-details/update-enquiry-details.handler";
import { AssignEnquiryHandler } from "./application/assign-enquiry/assign-enquiry.handler";
import { EnquiryController } from "./presentation/controllers/enquiry.controller";

@Module({
  controllers: [EnquiryController],

  providers: [
    {
      provide: ENQUIRY_REPOSITORY,
      useClass: EnquiryPrismaRepository,
    },
    CreateEnquiryHandler,
    GetEnquiryHandler,
    ListEnquiriesHandler,
    UpdateEnquiryStatusHandler,
    UpdateEnquiryDetailsHandler,
    AssignEnquiryHandler,
  ],

  exports: [
    ENQUIRY_REPOSITORY,
    CreateEnquiryHandler,
    GetEnquiryHandler,
    ListEnquiriesHandler,
    UpdateEnquiryStatusHandler,
    UpdateEnquiryDetailsHandler,
    AssignEnquiryHandler,
  ],
})
export class EnquiriesModule {}
