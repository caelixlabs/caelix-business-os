import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/common/prisma";

import { PrismaRepository } from "@/common/prisma/prisma.repository";

import { EventBus } from "@/common/ddd";

import { ProductMapper } from "../product.mapper";
import { ProductRepository } from "../../domain/repositories";
import { Product } from "../../domain/entities/product.entity";

@Injectable()
export class ProductPrismaRepository extends PrismaRepository implements ProductRepository {
    constructor(prisma: PrismaService, eventBus: EventBus) {
        super(prisma, eventBus);
    }
    async findAll(): Promise<Product[]> {
        const rows = await this.prisma.client.product.findMany({orderBy: {createdAt: 'desc'}});
        return rows.map(ProductMapper.toDomain);
    }

    async create(entity: Product): Promise<Product> {
        const model = await this.runInTransaction(entity, "Product", (tx) =>
            tx.product.create({
                data: ProductMapper.toPersistence(entity),
            })
        );

        return ProductMapper.toDomain(model);
    }

    async findById(id: string): Promise<Product | null> {
        const model = await this.prisma.client.product.findUnique({
            where: {id},
        });

        return model ? ProductMapper.toDomain(model) : null;
    }

    async findByCode(
        organizationId: string,
        code: string
    ): Promise<Product | null> {
        const model = await this.prisma.client.product.findFirst({
            where: {organizationId, code: code.trim().toUpperCase()},
        });

        return model ? ProductMapper.toDomain(model) : null;
    }

    async findByName(
        organizationId: string,
        name: string
    ): Promise<Product | null> {
        const model = await this.prisma.client.product.findFirst({
            where: {organizationId, name: name.trim()},
        });

        return model ? ProductMapper.toDomain(model) : null;
    }

    async findByOrganization(organizationId: string): Promise<Product[]> {
        const rows = await this.prisma.client.product.findMany({
            where: {organizationId},
            orderBy: {createdAt: "desc"},
        });

        return rows.map(ProductMapper.toDomain);
    }

    async findActiveByOrganization(organizationId: string): Promise<Product[]> {
        const rows = await this.prisma.client.product.findMany({
            where: {
                organizationId,
                status: "ACTIVE",
            },

            orderBy: {
                name: "asc",
            },
        });

        return rows.map(ProductMapper.toDomain);
    }

    async update(entity: Product): Promise<Product> {
        const model = await this.runInTransaction(entity, "Product", (tx) =>
            tx.product.update({
                where: {
                    id: entity.id,
                },

                data: ProductMapper.toPersistence(entity),
            })
        );

        return ProductMapper.toDomain(model);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.client.product.delete({
            where: {
                id,
            },
        });
    }
}
