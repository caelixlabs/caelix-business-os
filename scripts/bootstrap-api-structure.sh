#!/usr/bin/env bash

set -e

API_ROOT="apps/api/src"

echo "Creating directory structure..."

mkdir -p \
"$API_ROOT/common/ddd/events/bus" \
"$API_ROOT/common/ddd/events/decorators" \
"$API_ROOT/common/ddd/events/discovery" \
"$API_ROOT/common/ddd/events/interfaces" \
"$API_ROOT/common/ddd/events/registry" \
"$API_ROOT/common/framework/decorators" \
"$API_ROOT/common/framework/filters" \
"$API_ROOT/common/framework/guards" \
"$API_ROOT/common/framework/interceptors" \
"$API_ROOT/common/framework/middleware" \
"$API_ROOT/common/framework/pipes" \
"$API_ROOT/common/framework/validators" \
"$API_ROOT/common/prisma" \
"$API_ROOT/common/shared/constants" \
"$API_ROOT/common/shared/enums" \
"$API_ROOT/common/shared/types" \
"$API_ROOT/common/shared/utils" \
"$API_ROOT/core/branch" \
"$API_ROOT/core/organization/application/event-handlers" \
"$API_ROOT/core/organization/domain/events" \
"$API_ROOT/core/organization/domain/value-objects" \
"$API_ROOT/core/organization/infrastructure/mappers" \
"$API_ROOT/core/organization/infrastructure/repositories" \
"$API_ROOT/core/organization/presentation/presenters" \
"$API_ROOT/core/organization/presentation/requests" \
"$API_ROOT/core/organization/presentation/responses" \
"$API_ROOT/core/feature-flags" \
"$API_ROOT/core/notification"

echo "Creating files..."

touch \
"$API_ROOT/common/ddd/events/constants.ts" \
"$API_ROOT/common/ddd/events/events.module.ts" \
"$API_ROOT/common/framework/filters/global-exception.filter.ts" \
"$API_ROOT/common/prisma/prisma.repository.ts"

echo "Done."
