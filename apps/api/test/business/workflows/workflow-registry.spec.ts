// import { WorkflowRegistryService } from "@/business/workflows";

// import { MUSIC_CUSTOMER_LIFECYCLE_WORKFLOW } from "@/industry/music-org/workflows/music-customer-lifecycle.workflow";

// import { GYM_CUSTOMER_LIFECYCLE_WORKFLOW } from "@/industry/gym/workflows/gym-customer-lifecycle.workflow";

// describe("WorkflowRegistryService", () => {
//   let registry: WorkflowRegistryService;

//   beforeEach(() => {
//     registry = new WorkflowRegistryService();
//   });

//   it("should register and resolve a workflow", () => {
//     registry.register(MUSIC_CUSTOMER_LIFECYCLE_WORKFLOW);
//     const workflow = registry.get("music.customer-lifecycle");

//     expect(workflow.code).toBe("music.customer-lifecycle");
//     expect(workflow.industry).toBe("MUSIC_ORG");
//   });

//   it("should support different workflows for different industries", () => {
//     registry.register(MUSIC_CUSTOMER_LIFECYCLE_WORKFLOW);
//     registry.register(GYM_CUSTOMER_LIFECYCLE_WORKFLOW);

//     const music = registry.get("music.customer-lifecycle");
//     const gym = registry.get("gym.customer-lifecycle");

//     expect(music.steps.map((step) => step.code)).toEqual([
//       "ENQUIRY",
//       "BOOKING",
//       "ENROLLMENT",
//       "ORDER",
//       "PAYMENT",
//     ]);

//     expect(gym.steps.map((step) => step.code)).toEqual([
//       "ENQUIRY",
//       "BOOKING",
//       "ORDER",
//       "PAYMENT",
//     ]);
//   });

//   it("should identify registered workflows", () => {
//     registry.register(MUSIC_CUSTOMER_LIFECYCLE_WORKFLOW);

//     expect(registry.has("music.customer-lifecycle")).toBe(true);
//     expect(registry.has("gym.customer-lifecycle")).toBe(false);
//   });

//   it("should list registered workflows", () => {
//     registry.register(MUSIC_CUSTOMER_LIFECYCLE_WORKFLOW);
//     registry.register(GYM_CUSTOMER_LIFECYCLE_WORKFLOW);

//     expect(registry.list()).toHaveLength(2);
//   });

//   it("should reject duplicate workflow registration", () => {
//     registry.register(MUSIC_CUSTOMER_LIFECYCLE_WORKFLOW);
//     expect(() => registry.register(MUSIC_CUSTOMER_LIFECYCLE_WORKFLOW)).toThrow(
//       "Workflow 'music.customer-lifecycle' is already registered."
//     );
//   });
// });

import { NotFoundException } from "@nestjs/common";
import { WorkflowRegistryService } from "@/business/workflows";

// Minimal mock workflows decouple registry testing from domain logic changes
const MOCK_MUSIC_WORKFLOW = {
  code: "music.customer-lifecycle",
  industry: "MUSIC_ORG",
  steps: [{ code: "ENQUIRY" }, { code: "BOOKING" }],
};

const MOCK_GYM_WORKFLOW = {
  code: "gym.customer-lifecycle",
  industry: "GYM",
  steps: [{ code: "ENQUIRY" }, { code: "PAYMENT" }],
};

describe("WorkflowRegistryService", () => {
  let registry: WorkflowRegistryService;

  beforeEach(() => {
    registry = new WorkflowRegistryService();
  });

  describe("register & get", () => {
    it("should register and resolve a workflow by its code", () => {
      registry.register(MOCK_MUSIC_WORKFLOW as any);

      const workflow = registry.get("music.customer-lifecycle");
      expect(workflow).toBe(MOCK_MUSIC_WORKFLOW);
    });

    it("should support registering multiple distinct workflows", () => {
      registry.register(MOCK_MUSIC_WORKFLOW as any);
      registry.register(MOCK_GYM_WORKFLOW as any);

      expect(registry.get("music.customer-lifecycle")).toBe(MOCK_MUSIC_WORKFLOW);
      expect(registry.get("gym.customer-lifecycle")).toBe(MOCK_GYM_WORKFLOW);
    });

    it("should reject duplicate workflow registration with an error", () => {
      registry.register(MOCK_MUSIC_WORKFLOW as any);

      expect(() => registry.register(MOCK_MUSIC_WORKFLOW as any)).toThrow(
        "Workflow 'music.customer-lifecycle' is already registered."
      );
    });

    it("should throw NotFoundException when retrieving an unregistered workflow", () => {
      expect(() => registry.get("unregistered.workflow")).toThrow(
        NotFoundException
      );
      expect(() => registry.get("unregistered.workflow")).toThrow(
        "Workflow 'unregistered.workflow' is not registered."
      );
    });
  });

  describe("has", () => {
    it("should return true for registered workflows and false otherwise", () => {
      registry.register(MOCK_MUSIC_WORKFLOW as any);

      expect(registry.has("music.customer-lifecycle")).toBe(true);
      expect(registry.has("gym.customer-lifecycle")).toBe(false);
    });
  });

  describe("list", () => {
    it("should return an empty array when no workflows are registered", () => {
      expect(registry.list()).toEqual([]);
    });

    it("should list all registered workflows", () => {
      registry.register(MOCK_MUSIC_WORKFLOW as any);
      registry.register(MOCK_GYM_WORKFLOW as any);

      const list = registry.list();

      expect(list).toHaveLength(2);
      expect(list).toContain(MOCK_MUSIC_WORKFLOW);
      expect(list).toContain(MOCK_GYM_WORKFLOW);
    });
  });
});
