import { Module } from '@nestjs/common';

/**
 * Placeholder for genuinely foundational, dependency-free kernel
 * concerns (id generation, clock, etc. — currently plain static
 * utilities under kernel/utility that don't need DI). Kernel must
 * never import a business module (core/*) — everything else may
 * depend on kernel, never the reverse.
 */
@Module({})
export class KernelModule {}
