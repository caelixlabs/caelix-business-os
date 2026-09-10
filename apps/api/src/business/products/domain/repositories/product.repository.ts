import { Repository } from "@/common/ddd";

import { Product } from "../entities/product.entity";

export interface ProductRepository extends Repository<Product> {
  findByCode(organizationId: string, code: string): Promise<Product | null>;

  findByName(organizationId: string, name: string): Promise<Product | null>;

  findByOrganization(organizationId: string): Promise<Product[]>;

  findActiveByOrganization(organizationId: string): Promise<Product[]>;
}
