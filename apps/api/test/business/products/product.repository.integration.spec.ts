import { Test, TestingModule } from "@nestjs/testing";

import { PrismaService } from "@/common/prisma/prisma.service";

import { EventBus } from "@/common/ddd";

import { ProductPrismaRepository } from "@/business/products/infrastructure/prisma/product.prisma.repository";

import { Product } from "@/business/products/domain/entities/product.entity";

import { ProductStatus, ProductType } from "@/business/products/domain/enums";

jest.mock("@/common/prisma/prisma.service", () => ({
    PrismaService: class { },
}));

jest.mock("@caelix-business-os/database", () => ({
    ProductType: {
        PRODUCT: "PRODUCT",
        SERVICE: "SERVICE",
    },

    ProductStatus: {
        ACTIVE: "ACTIVE",
        INACTIVE: "INACTIVE",
        ARCHIVED: "ARCHIVED",
    },
}));

describe("ProductPrismaRepository Integration", () => {
    let repository: ProductPrismaRepository;

    const txClient = {
        product: {
            create: jest.fn(),

            update: jest.fn(),
        },

        domainEvent: {
            createMany: jest.fn(),
        },
    };

    const prismaMock = {
        client: {
            $transaction: jest.fn(
                async (work: (tx: typeof txClient) => Promise<unknown>) =>
                    work(txClient)
            ),

            product: {
                findUnique: jest.fn(),

                findFirst: jest.fn(),

                findMany: jest.fn(),

                delete: jest.fn(),
            },
        },
    };

    const eventBusMock = {
        publish: jest.fn(),

        publishAll: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductPrismaRepository,

                {
                    provide: PrismaService,

                    useValue: prismaMock,
                },

                {
                    provide: EventBus,

                    useValue: eventBusMock,
                },
            ],
        }).compile();

        repository = module.get(ProductPrismaRepository);
    });

    it("should persist product and publish its domain event", async () => {
        const product = Product.create({
            id: "product-1",

            organizationId: "org-1",

            name: "Guitar Lesson",

            code: "GUITAR-LESSON",

            type: ProductType.SERVICE,

            price: 1500,

            currency: "INR",

            taxRate: 18,
        });

        txClient.product.create.mockResolvedValue({
            id: "product-1",

            organizationId: "org-1",

            name: "Guitar Lesson",

            code: "GUITAR-LESSON",

            description: null,

            type: ProductType.SERVICE,

            status: ProductStatus.ACTIVE,

            price: 1500,

            currency: "INR",

            taxRate: 18,

            createdAt: new Date(),

            updatedAt: new Date(),
        });

        const result = await repository.create(product);

        expect(prismaMock.client.$transaction).toHaveBeenCalledTimes(1);

        expect(txClient.product.create).toHaveBeenCalledTimes(1);

        expect(txClient.domainEvent.createMany).toHaveBeenCalledTimes(1);

        expect(eventBusMock.publishAll).toHaveBeenCalledTimes(1);

        expect(result).toBeInstanceOf(Product);

        expect(result.id).toBe("product-1");

        expect(result.name).toBe("Guitar Lesson");

        expect(result.type).toBe(ProductType.SERVICE);

        expect(result.status).toBe(ProductStatus.ACTIVE);

        expect(result.price).toBe(1500);
    });

    it("should return products for an organization", async () => {
        prismaMock.client.product.findMany.mockResolvedValue([
            {
                id: "product-1",

                organizationId: "org-1",

                name: "Guitar Lesson",

                code: "GUITAR",

                description: null,

                type: "SERVICE",

                status: "ACTIVE",

                price: 1500,

                currency: "INR",

                taxRate: null,

                createdAt: new Date(),

                updatedAt: new Date(),
            },
        ]);

        const result = await repository.findByOrganization("org-1");

        expect(result).toHaveLength(1);

        expect(result[0]).toBeInstanceOf(Product);

        expect(result[0].organizationId).toBe("org-1");
    });

    it("should map archived product correctly", async () => {
        prismaMock.client.product.findUnique.mockResolvedValue({
            id: "product-archived",

            organizationId: "org-1",

            name: "Old Course",

            code: "OLD-COURSE",

            description: null,

            type: "SERVICE",

            status: "ARCHIVED",

            price: 500,

            currency: "INR",

            taxRate: null,

            createdAt: new Date(),

            updatedAt: new Date(),
        });

        const result = await repository.findById("product-archived");

        expect(result).toBeInstanceOf(Product);

        expect(result?.status).toBe(ProductStatus.ARCHIVED);
    });
});
