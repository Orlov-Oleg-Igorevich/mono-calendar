import { IRMQServiceAsyncOptions, IRMQServiceOptions } from 'nestjs-rmq';
import { TypedConfigModule } from '../common/typed-config/typed-config.module';
import { TypedConfigService } from '../common/typed-config/typed-config.service';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
  imports: [TypedConfigModule],
  inject: [TypedConfigService],
  useFactory: (configService: TypedConfigService): IRMQServiceOptions => ({
    exchangeName: configService.exchangeRMQName,
    connections: [
      {
        login: configService.loginRMQ,
        password: configService.passwordRMQ,
        host: configService.hostRMQ,
        port: configService.portRMQ,
      },
    ],
    queueName: configService.queueRMQName,
    prefetchCount: configService.prefetchRMQCount,
    serviceName: configService.serviceName,
  }),
});
