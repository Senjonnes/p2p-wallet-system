import * as crypto from 'crypto';
import { configService } from '../config/typeorm.config';

const ENCRYPTION_KEY = configService.getValue('ENCRYPTION_KEY'); // Must be 256 bits (32 characters)
const IV_LENGTH = parseInt(configService.getValue('IV_LENGTH')); // For AES, this is always 16

export const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const final_ = iv.toString('hex') + ':' + encrypted.toString('hex');
  return final_;
};

export const decrypt = (text) => {
  if (text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      iv,
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } else {
    return null;
  }
};
