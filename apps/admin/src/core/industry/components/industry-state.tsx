export function IndustryUnconfiguredState() {
  return (
    <div className="rounded-2xl border border-danger-soft bg-danger-soft p-6">
      <h1 className="font-semibold text-danger">
        Industry configuration required
      </h1>
      <p className="mt-1 text-sm text-danger/80">
        This organization does not have a supported industry configuration.
      </p>
    </div>
  );
}

export function OrganizationUnavailableState() {
  return (
    <div className="rounded-2xl border border-danger-soft bg-danger-soft p-6">
      <h1 className="font-semibold text-danger">
        Organization unavailable
      </h1>
      <p className="mt-1 text-sm text-danger/80">
        We could not load the current organization workspace.
      </p>
    </div>
  );
}
