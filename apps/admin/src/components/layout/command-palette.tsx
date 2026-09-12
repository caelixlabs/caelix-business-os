'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUIStore } from '@/store/ui.store';
import { useNavigationItems } from '@/core/navigation/hooks/use-navigation-items';

export function CommandPalette() {
  const router = useRouter();
  const open = useUIStore((state) => state.commandPaletteOpen);
  const setOpen = useUIStore((state) => state.setCommandPaletteOpen);
  const navigationGroups = useNavigationItems();

  const [query, setQuery] = useState('');
  const [rawActiveIndex, setActiveIndex] = useState(0);

  const items = useMemo(
    () =>
      navigationGroups.flatMap((group) =>
        group.items.map((item) => ({
          ...item,
          group: group.label ?? 'Navigation',
        })),
      ),
    [navigationGroups],
  );

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return items;

    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(search) ||
        item.href.toLowerCase().includes(search) ||
        item.group.toLowerCase().includes(search),
    );
  }, [items, query]);

  // Clamp during render instead of syncing via an effect: filtered.length can
  // shrink (typing narrows the query) without a matching arrow-key update.
  const activeIndex = Math.min(rawActiveIndex, Math.max(filtered.length - 1, 0));

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, [setOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(!open);
        return;
      }

      if (!open) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closePalette();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((current) =>
          filtered.length ? (current + 1) % filtered.length : 0,
        );
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) =>
          filtered.length
            ? (current - 1 + filtered.length) % filtered.length
            : 0,
        );
        return;
      }

      if (event.key === 'Enter' && filtered[activeIndex]) {
        event.preventDefault();
        router.push(filtered[activeIndex].href);
        closePalette();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, filtered, open, router, setOpen, closePalette]);

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : closePalette())}>
      <DialogContent
        title="Search"
        description="Jump to a page in your workspace."
        className="max-w-xl p-0"
      >
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-text-secondary" />
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              placeholder="Search pages, actions..."
              className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-secondary"
            />
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-secondary">
              Esc
            </kbd>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-text-secondary">
              No matching pages.
            </div>
          ) : (
            filtered.map((item, index) => {
              const Icon = item.icon;
              const active = index === activeIndex;

              return (
                <button
                  key={item.key}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    router.push(item.href);
                    closePalette();
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    active ? 'bg-canvas' : ''
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">
                      {item.label}
                    </p>
                    <p className="truncate text-[11px] text-text-secondary">
                      {item.group}
                    </p>
                  </div>

                  <kbd className="font-mono text-[10px] text-text-secondary">
                    ↵
                  </kbd>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
