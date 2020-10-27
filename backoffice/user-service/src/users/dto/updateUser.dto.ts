import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly company: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  encode: string;
}
