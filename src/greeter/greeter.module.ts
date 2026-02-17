import { Module } from '@nestjs/common';
import { GreeterService } from './greeter.service';
import { GreeterWizard } from './wizard/greeter.wizard';
import { GreeterUpdate } from './greeter.update';

@Module({
  providers: [GreeterWizard, GreeterUpdate],
})
export class GreeterModule {}
