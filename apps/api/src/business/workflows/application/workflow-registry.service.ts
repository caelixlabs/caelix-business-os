import { Injectable, NotFoundException } from "@nestjs/common";

import { WorkflowDefinition } from "../domain";

@Injectable()
export class WorkflowRegistryService {
  private readonly workflows = new Map<string, WorkflowDefinition>();

  register(workflow: WorkflowDefinition): void {
    if (this.workflows.has(workflow.code)) {
      throw new Error(`Workflow '${workflow.code}' is already registered.`);
    }

    this.workflows.set(workflow.code, workflow);
  }

  get(code: string): WorkflowDefinition {
    const workflow = this.workflows.get(code);

    if (!workflow) {
      throw new NotFoundException(`Workflow '${code}' is not registered.`);
    }

    return workflow;
  }

  has(code: string): boolean {
    return this.workflows.has(code);
  }

  list(): WorkflowDefinition[] {
    return [...this.workflows.values()];
  }
}
