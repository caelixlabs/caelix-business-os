"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/store/auth.store";

import {
  useBranches,
  useCreateBranch,
  useToggleBranchStatus,
  useUpdateBranch,
  useDeleteBranch,
} from "@/features/branches/api/use-branches";

import {
  createBranchSchema,
  type CreateBranchFormValues,
} from "@/features/branches/schemas/branch.schema";

import type { Branch } from "@/features/branches/types";

import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { StatusBadge, StatusRail } from "@/components/ui/badge";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PermissionGate } from "@/components/auth/permission-gate";

function EditBranchForm({
  branch,
  organizationId,
  onDone,
}: {
  branch: Branch;
  organizationId: string;
  onDone: () => void;
}) {
  const updateBranch = useUpdateBranch(organizationId);

  const { register, handleSubmit } = useForm<{
    name: string;
    description: string;
  }>({
    defaultValues: {
      name: branch.name,
      description: branch.description ?? "",
    },
  });

  function onSubmit(values: { name: string; description: string }) {
    updateBranch.mutate(
      {
        id: branch.id,
        name: values.name,
        description: values.description || undefined,
      },
      {
        onSuccess: onDone,
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Branch name" htmlFor={`edit-name-${branch.id}`}>
        <Input
          id={`edit-name-${branch.id}`}
          autoFocus
          {...register("name", {
            required: true,
          })}
        />
      </Field>

      <Field label="Description" htmlFor={`edit-description-${branch.id}`}>
        <Input
          id={`edit-description-${branch.id}`}
          placeholder="Optional description"
          {...register("description")}
        />
      </Field>

      <Button type="submit" loading={updateBranch.isPending}>
        Save changes
      </Button>
    </form>
  );
}

function EditBranchDialog({
  branch,
  organizationId,
}: {
  branch: Branch;
  organizationId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="!px-2 !py-1 text-xs">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent title="Edit branch" description={`Update ${branch.name}.`}>
        <EditBranchForm
          branch={branch}
          organizationId={organizationId}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function CreateBranchForm({
  organizationId,
  onDone,
}: {
  organizationId: string;
  onDone: () => void;
}) {
  const createBranch = useCreateBranch(organizationId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBranchFormValues>({
    resolver: zodResolver(createBranchSchema),
  });

  function onSubmit(values: CreateBranchFormValues) {
    createBranch.mutate(values, {
      onSuccess: onDone,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Branch name" htmlFor="name" error={errors.name?.message}>
        <Input
          id="name"
          placeholder="Downtown Studio"
          autoFocus
          {...register("name")}
        />
      </Field>

      <Field
        label="Code"
        htmlFor="code"
        hint="Short identifier, e.g. DTOWN"
        error={errors.code?.message}
      >
        <Input id="code" {...register("code")} />
      </Field>

      <Button type="submit" loading={createBranch.isPending}>
        Create branch
      </Button>
    </form>
  );
}

export default function BranchesPage() {
  const user = useAuthStore((s) => s.user);
  const organizationId = user?.organizationId;
  const { data: branches, isLoading } = useBranches(organizationId);
  const toggleStatus = useToggleBranchStatus(organizationId ?? "");
  const deleteBranch = useDeleteBranch(organizationId ?? "");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Branches"
        description="Locations or business units within your organization."
        action={
          <PermissionGate permission="branch:create">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>New branch</Button>
              </DialogTrigger>

              <DialogContent
                title="Create a branch"
                description="Add a new location or business unit."
              >
                {organizationId && (
                  <CreateBranchForm
                    organizationId={organizationId}
                    onDone={() => setDialogOpen(false)}
                  />
                )}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : !branches || branches.length === 0 ? (
        <EmptyState
          title="No branches yet"
          description="Every organization gets a primary branch automatically."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {branches.map((branch: Branch) => (
            <Card key={branch.id} className="p-4">
              <StatusRail
                status={branch.type === "PRIMARY" ? "PRIMARY" : branch.status}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">
                      {branch.name}
                    </p>

                    <p className="font-mono text-xs text-text-secondary">
                      {branch.code}
                    </p>

                    {branch.description && (
                      <p className="mt-2 text-xs text-text-secondary">
                        {branch.description}
                      </p>
                    )}
                  </div>

                  <StatusBadge
                    status={
                      branch.type === "PRIMARY" ? "PRIMARY" : branch.status
                    }
                  />
                </div>

                <div className="mt-3 flex gap-2">
                  {organizationId && (
                    <PermissionGate permission="branch:update">
                      <EditBranchDialog
                        branch={branch}
                        organizationId={
                          organizationId
                        }
                      />
                    </PermissionGate>
                  )}

                  {branch.type !== "PRIMARY" && (
                    <>
                      <PermissionGate permission="branch:archive">
                        <Button
                          variant="ghost"
                          className="!px-2 !py-1 text-xs"
                          disabled={
                            toggleStatus.isPending
                          }
                          onClick={() =>
                            toggleStatus.mutate({
                              id: branch.id,
                              nextStatus:
                                branch.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE',
                            })
                          }
                        >
                          {branch.status === 'ACTIVE' ? 'Archive' : 'Activate'}
                        </Button>
                      </PermissionGate>

                      {branch.status === "ARCHIVED" && (
                        <PermissionGate
                          permission="branch:delete"
                        >
                          <Button
                            variant="danger"
                            className="!px-2 !py-1 text-xs"
                            disabled={deleteBranch.isPending}
                            onClick={() => {
                              const confirmed =
                                window.confirm(`Delete "${branch.name}" permanently?`);
                              if (confirmed) {
                                deleteBranch.mutate(branch.id);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </PermissionGate>
                      )}
                    </>
                  )}
                </div>
              </StatusRail>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
