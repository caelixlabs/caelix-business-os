import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/api/client';
import { communicationApi } from './communication.api';

const keys = {
  messages: (organizationId: string) => ['messages', organizationId] as const,
  templates: (organizationId: string) => ['message-templates', organizationId] as const,
  channels: (organizationId: string) => ['message-channels', organizationId] as const,
};

export const useMessages = (organizationId: string | undefined) =>
  useQuery({
    queryKey: keys.messages(organizationId ?? ''),
    queryFn: () => communicationApi.messages(organizationId as string),
    enabled: Boolean(organizationId),
  });

export const useMessageTemplates = (organizationId: string | undefined) =>
  useQuery({
    queryKey: keys.templates(organizationId ?? ''),
    queryFn: () => communicationApi.templates(organizationId as string),
    enabled: Boolean(organizationId),
  });

export const useChannelStatus = (organizationId: string | undefined) =>
  useQuery({
    queryKey: keys.channels(organizationId ?? ''),
    queryFn: () => communicationApi.channels(organizationId as string),
    enabled: Boolean(organizationId),
    staleTime: 5 * 60_000,
  });

function useCommunicationMutation<TVars>(
  organizationId: string,
  invalidate: 'messages' | 'templates',
  mutationFn: (vars: TVars) => Promise<unknown>,
  successMessage: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys[invalidate](organizationId) });
      toast.success(successMessage);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong.');
    },
  });
}

export const useSendMessage = (organizationId: string) =>
  useCommunicationMutation(
    organizationId,
    'messages',
    (input: Parameters<typeof communicationApi.send>[1]) => communicationApi.send(organizationId, input),
    'Message sent.',
  );

export const useCreateTemplate = (organizationId: string) =>
  useCommunicationMutation(
    organizationId,
    'templates',
    (input: Parameters<typeof communicationApi.createTemplate>[1]) =>
      communicationApi.createTemplate(organizationId, input),
    'Template saved.',
  );

export const useDeleteTemplate = (organizationId: string) =>
  useCommunicationMutation(
    organizationId,
    'templates',
    (id: string) => communicationApi.removeTemplate(organizationId, id),
    'Template deleted.',
  );
