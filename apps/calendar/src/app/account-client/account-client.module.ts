import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AccountClientService } from './account-client.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 1000,
      maxRedirects: 5,
    }),
  ],
  providers: [AccountClientService],
  exports: [AccountClientService],
})
export class AccountClientModule {}
