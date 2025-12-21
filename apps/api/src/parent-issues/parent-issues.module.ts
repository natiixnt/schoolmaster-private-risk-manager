import { Module } from '@nestjs/common';
import { ParentIssuesService } from './parent-issues.service';
import { ParentIssuesController } from './parent-issues.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParentIssuesController],
  providers: [ParentIssuesService],
  exports: [ParentIssuesService],
})
export class ParentIssuesModule {}
