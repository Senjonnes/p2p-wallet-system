import { ResponseCode } from 'src/enum/ResponseCode.enum';

export interface Res {
  message: string;
  status: boolean;
  data?: any;
  code: ResponseCode;
}
