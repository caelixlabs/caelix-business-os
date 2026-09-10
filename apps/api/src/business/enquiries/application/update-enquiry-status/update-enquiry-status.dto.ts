import {
  IsIn,
} from 'class-validator';

import {
  EnquiryStatus,
} from '../../domain/enums';

export class UpdateEnquiryStatusDto {
  @IsIn([
    EnquiryStatus.CONTACTED,
    EnquiryStatus.QUALIFIED,
    EnquiryStatus.CONVERTED,
    EnquiryStatus.LOST,
  ])
  status!: EnquiryStatus;
}