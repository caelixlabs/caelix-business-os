export interface WorkflowStep {
  /**
   * Stable identifier for the step.
   *
   * Example:
   * ENQUIRY
   * BOOKING
   * ENROLLMENT
   * ORDER
   * PAYMENT
   */
  readonly code: string;

  /**
   * Human-readable name.
   */
  readonly name: string;

  /**
   * Business capability responsible
   * for this step.
   */
  readonly capability: string;

  /**
   * Optional next step.
   *
   * This is descriptive workflow metadata.
   * Actual execution is handled by
   * workflow handlers.
   */
  readonly next?: string;
}
