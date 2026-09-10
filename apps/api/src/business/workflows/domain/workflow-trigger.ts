export interface WorkflowTrigger {
  /**
   * Event emitted by a business capability.
   *
   * Example:
   *
   * BookingConfirmedEvent
   */
  readonly eventName: string;

  /**
   * Step that produced the event.
   */
  readonly fromStep: string;

  /**
   * Step that should become active.
   */
  readonly toStep: string;
}