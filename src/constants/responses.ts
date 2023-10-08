import { ResponseCode } from 'src/enum/ResponseCode.enum';
import { AuthRes } from 'src/models/AuthRes.model';
import { Res } from 'src/models/Res.model';

export const MESSAGES = {
  ACCOUNT_CREATED_SUCCESSFULLY:
    'Your account has been created successfully. Please check your email, a verification code has been sent to you for account verification.',
  ACCOUNT_VERIFICATION_CODE_FAILED:
    'Your account has not been verified. Please check your email, a verification code has been sent to you for account verification.',
  ACCOUNT_DISABLED:
    'Your account has been disabled. Please contact our support for further assistance',
  EXPIRED_INVALID_CODE:
    'Invalid Verification Code or Verification Code has expired',
  INVALID_OTP: 'Invalid OTP or OTP has expired',
  FORGOT_PASSWORD_EMAIL_SENT:
    'Please check your email, a password reset OTP has been sent to you.',
  PASSWORD_NOT_MATCHED: 'Password does not match',
  PIN_CREATED_SUCCESSFULLY: 'Pin created successfully',
};

export const INVALID_PARAMETER = (MESSAGE) => {
  const res: AuthRes = {
    message: MESSAGES[MESSAGE],
    status: false,
    data: null,
    code: ResponseCode.INVALID_PARAMETER,
  };
  return res;
};

export const FAILED = (MESSAGE) => {
  const res: AuthRes = {
    message: MESSAGES[MESSAGE],
    status: false,
    data: null,
    code: ResponseCode.NOT_VERIFIED,
  };
  return res;
};

export const AUTHRES = (MESSAGE, CODE, DATA?, ACCESS_TOKEN?) => {
  const res: AuthRes = {
    message: MESSAGES[MESSAGE],
    status: true,
    code: ResponseCode[CODE],
  };
  if (DATA) res.data = DATA;
  if (ACCESS_TOKEN) res.accessToken = ACCESS_TOKEN;
  return res;
};

export const AUTHRESFAILED = (MESSAGE, CODE) => {
  const res: AuthRes = {
    message: MESSAGES[MESSAGE],
    status: false,
    code: ResponseCode[CODE],
  };
  return res;
};

export const RES = (MESSAGE, CODE, STATUS, DATA?) => {
  const res: Res = {
    message: MESSAGES[MESSAGE],
    status: STATUS,
    code: ResponseCode[CODE],
  };
  if (DATA) res.data = DATA;
  return res;
};
