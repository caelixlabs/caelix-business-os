import { WorkflowStep } from "./workflow-step";

import { WorkflowTrigger } from "./workflow-trigger";

export interface WorkflowDefinition {
  /**
   * Stable workflow identifier.
   *
   * Example:
   * music.customer-lifecycle
   */
  readonly code: string;

  /**
   * Human-readable name.
   */
  readonly name: string;

  /**
   * Industry owning this workflow.
   */
  readonly industry: string;

  /**
   * Ordered business lifecycle.
   */
  readonly steps: readonly WorkflowStep[];

  /**
   * Events that move the lifecycle
   * between capabilities.
   */
  readonly triggers: readonly WorkflowTrigger[];
}
