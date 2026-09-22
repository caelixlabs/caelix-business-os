'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useDeleteTemplate, useMessages, useMessageTemplates } from '@/features/communication/api/use-communication';
import { CHANNEL_LABELS, type Message, type MessageStatus, type MessageTemplate } from '@/features/communication/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { formatDate } from '@/lib/format';
import { CreateTemplateForm } from './components/CreateTemplateForm';
import { SendMessageForm } from './components/SendMessageForm';

const STATUS_TONE: Record<MessageStatus, 'success' | 'info' | 'danger'> = {
  SENT: 'success',
  LOGGED: 'info',
  FAILED: 'danger',
};

const STATUS_LABEL: Record<MessageStatus, string> = {
  SENT: 'sent',
  LOGGED: 'recorded only',
  FAILED: 'failed',
};

function recipientName(message: Message) {
  const contact = message.contact;
  const name = contact ? [contact.firstName, contact.lastName].filter(Boolean).join(' ') || contact.companyName : '';
  return name ? `${name} · ${message.toAddress}` : message.toAddress;
}

export function CommunicationSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: messages, isLoading: messagesLoading } = useMessages(organizationId);
  const { data: templates, isLoading: templatesLoading } = useMessageTemplates(organizationId);
  const removeTemplate = useDeleteTemplate(organizationId ?? '');
  const [sendOpen, setSendOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);

  const messageColumns: ColumnDef<Message, unknown>[] = [
    { accessorKey: 'createdAt', header: 'When', cell: ({ getValue }) => <span className="whitespace-nowrap">{formatDate(getValue() as string, 'relative')}</span> },
    { id: 'channel', header: 'Channel', accessorFn: (row) => CHANNEL_LABELS[row.channel] },
    { id: 'to', header: 'To', accessorFn: recipientName },
    {
      id: 'message',
      header: 'Message',
      accessorFn: (row) => row.subject || row.body,
      cell: ({ getValue }) => <span className="block max-w-xs truncate">{getValue() as string}</span>,
    },
    {
      id: 'source',
      header: 'Sent by',
      accessorFn: (row) => (row.source.startsWith('automation') ? 'Automation' : row.source.startsWith('esign') ? 'E-signature' : 'Team'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge tone={STATUS_TONE[row.original.status]}>{STATUS_LABEL[row.original.status]}</Badge>
      ),
    },
  ];

  const templateColumns: ColumnDef<MessageTemplate, unknown>[] = [
    { accessorKey: 'name', header: 'Template' },
    { id: 'channel', header: 'Channel', accessorFn: (row) => CHANNEL_LABELS[row.channel] },
    {
      id: 'preview',
      header: 'Message',
      accessorFn: (row) => row.body,
      cell: ({ getValue }) => <span className="block max-w-sm truncate">{getValue() as string}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <PermissionGate permission="communication:manage">
          <button
            type="button"
            aria-label={`Delete ${row.original.name}`}
            onClick={() => removeTemplate.mutate(row.original.id)}
            className="text-text-secondary hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </PermissionGate>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Email, SMS and WhatsApp in one place — every message sent by your team or your automations is recorded here."
        action={
          <PermissionGate permission="communication:send">
            <Dialog open={sendOpen} onOpenChange={setSendOpen}>
              <DialogTrigger asChild>
                <Button>Send message</Button>
              </DialogTrigger>
              <DialogContent title="Send a message" description="Reach a contact by email, SMS or WhatsApp.">
                {organizationId && <SendMessageForm organizationId={organizationId} onDone={() => setSendOpen(false)} />}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <Tabs defaultValue="messages">
        <TabsList>
          <TabsTrigger value="messages">History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <DataTable
            columns={messageColumns}
            data={messages ?? []}
            loading={messagesLoading}
            searchPlaceholder="Search messages..."
            emptyTitle="No messages yet"
            emptyDescription="Send a message, or set up an automation to send them for you."
          />
        </TabsContent>

        <TabsContent value="templates">
          <div className="mb-3 flex justify-end">
            <PermissionGate permission="communication:manage">
              <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary">New template</Button>
                </DialogTrigger>
                <DialogContent title="Create a template" description="Reusable wording for messages you send often.">
                  {organizationId && <CreateTemplateForm organizationId={organizationId} onDone={() => setTemplateOpen(false)} />}
                </DialogContent>
              </Dialog>
            </PermissionGate>
          </div>
          <DataTable
            columns={templateColumns}
            data={templates ?? []}
            loading={templatesLoading}
            searchPlaceholder="Search templates..."
            emptyTitle="No templates yet"
            emptyDescription="Save the wording you reuse, like appointment reminders."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
