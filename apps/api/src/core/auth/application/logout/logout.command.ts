import { LogoutDto } from './logout.dto';

export class LogoutCommand {
  constructor(public readonly dto: LogoutDto) {}
}
