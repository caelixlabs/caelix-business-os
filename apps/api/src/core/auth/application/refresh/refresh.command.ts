import { RefreshDto } from './refresh.dto';

export class RefreshCommand {
  constructor(public readonly dto: RefreshDto) {}
}
