import { ResponseCode } from 'src/enum/ResponseCode.enum';

export interface AuthRes {
  message: string;
  status: boolean;
  data?: any;
  code: ResponseCode;
  accessToken?: string;
}
