import { Module } from '@nestjs/common';
import { OutboxPublisher } from './outbox/outbox.publisher';

@Module({
  imports: [],
  providers: [OutboxPublisher],
})
export class PublisherModule {}
