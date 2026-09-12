import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "./users.api";
import { ApiError } from "@/api/client";

export const userKeys = {
  list: (organizationId: string) => ["users", organizationId] as const,

  detail: (userId: string) => ["user", userId] as const,
};

export function useUsers(organizationId: string | undefined) {
  return useQuery({
    queryKey: userKeys.list(organizationId ?? ""),

    queryFn: () => usersApi.list(organizationId as string),

    enabled: Boolean(organizationId),
  });
}

export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(userId ?? ""),

    queryFn: () => usersApi.get(userId as string),

    enabled: Boolean(userId),
  });
}

export function useInviteUser(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      email: string;
      temporaryPassword: string;
      firstName: string;
      lastName: string;
      branchId?: string;
    }) => usersApi.invite(organizationId, input),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.list(organizationId),
      });

      toast.success("User invited.");
    },

    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Could not invite user."
      );
    },
  });
}

export function useAssignRole(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { userId: string; roleId: string }) =>
      usersApi.assignRole(params.userId, params.roleId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.list(organizationId),
      });

      toast.success("Role updated.");
    },

    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Could not update role."
      );
    },
  });
}

export function useUpdateUserStatus(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { userId: string; status: "ACTIVE" | "SUSPENDED" }) =>
      usersApi.updateStatus(params.userId, params.status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.list(organizationId),
      });

      toast.success("User status updated.");
    },

    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not update user status."
      );
    },
  });
}

export function useAssignUserBranch(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { userId: string; branchId?: string }) =>
      usersApi.assignBranch(params.userId, params.branchId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.list(organizationId),
      });

      toast.success("User branch updated.");
    },

    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not update user branch."
      );
    },
  });
}
