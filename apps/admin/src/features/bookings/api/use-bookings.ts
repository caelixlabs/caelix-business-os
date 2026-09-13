import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingsApi } from './bookings.api';
import { ApiError } from '@/api/client';

export const bookingKeys = {
  list: (organizationId: string, filters?: { status?: string; contactId?: string }) =>
    ['bookings', organizationId, filters ?? {}] as const,
};

export function useBookings(
  organizationId: string | undefined,
  filters?: { status?: string; contactId?: string },
) {
  return useQuery({
    queryKey: bookingKeys.list(organizationId ?? '', filters),
    queryFn: () => bookingsApi.list(organizationId as string, filters),
    enabled: Boolean(organizationId),
  });
}

export function useCreateBooking(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof bookingsApi.create>[1]) =>
      bookingsApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', organizationId] });
      toast.success('Booking created.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create booking.');
    },
  });
}

export function useConfirmBooking(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsApi.confirm(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', organizationId] });
      toast.success('Booking confirmed.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not confirm booking.');
    },
  });
}

export function useCancelBooking(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', organizationId] });
      toast.success('Booking cancelled.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not cancel booking.');
    },
  });
}
