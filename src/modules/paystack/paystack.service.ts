import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, retry } from 'rxjs';
import { configService } from 'src/config/typeorm.config';
import { PaystackPaymentStatus } from 'src/models/PaystackPaymentStatus.model';

@Injectable()
export class PaystackService {
  constructor(private http: HttpService) {}

  async verifyPayment(reference: string): Promise<PaystackPaymentStatus> {
    const PAYSTACK_BASE_URL = configService.getValue('PAYSTACK_BASE_URL');
    const PAYSTACK_SECRET_KEY = configService.getValue('PAYSTACK_SECRET_KEY');
    return await this.http
      .get(`${PAYSTACK_BASE_URL}transaction/verify/${reference}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      })
      .pipe(
        retry(1),
        map((response) => {
          return response.data;
        }),
      )
      .toPromise();
  }
}
