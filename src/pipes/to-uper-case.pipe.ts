import { PipeTransform } from '@nestjs/common';

export class ToUpperCase implements PipeTransform {
  transform(value: any) {
    value = value.toUpperCase();

    return value;
  }
}
