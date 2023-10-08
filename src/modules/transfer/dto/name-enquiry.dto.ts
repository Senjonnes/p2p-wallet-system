import { IsNumberString } from 'class-validator';

export class NameEnquiryDto {
  @IsNumberString()
  account_no: string;
}
