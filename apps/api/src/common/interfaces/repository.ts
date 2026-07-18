export interface Repository<TEntity, TId> {
  findById(id: TId): Promise<TEntity | null>;

  findAll(): Promise<TEntity[]>;

  create(entity: TEntity): Promise<TEntity>;

  update(entity: TEntity): Promise<TEntity>;

  delete(id: TId): Promise<void>;
}