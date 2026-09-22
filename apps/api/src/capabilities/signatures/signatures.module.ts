import { Module } from "@nestjs/common";

import { PublicSignaturesController, SignaturesController } from "./signatures.controller";
import { SignaturesService } from "./signatures.service";

@Module({
  controllers: [SignaturesController, PublicSignaturesController],
  providers: [SignaturesService],
})
export class SignaturesModule {}
