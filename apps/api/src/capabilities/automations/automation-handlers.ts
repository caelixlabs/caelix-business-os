import { Inject, Injectable } from "@nestjs/common";

import { EventHandler, IEventHandler } from "@/common/ddd";

import { AutomationEngineService } from "./automation-engine.service";
import { AUTOMATION_TRIGGERS } from "./automation-triggers";

// One thin handler per trigger, generated from the catalog so adding a
// trigger there is the only step needed to make it automatable.
export const AUTOMATION_HANDLERS = AUTOMATION_TRIGGERS.map(({ key, event }) => {
  @Injectable()
  @EventHandler(event)
  class AutomationTriggerHandler implements IEventHandler<{ organizationId: string; occurredOn: Date }> {
    constructor(@Inject(AutomationEngineService) readonly engine: AutomationEngineService) {}

    handle(occurred: { organizationId: string; occurredOn: Date }): Promise<void> {
      return this.engine.run(key, occurred);
    }
  }

  return AutomationTriggerHandler;
});
