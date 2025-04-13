import {
    DataSource,
    DeepPartial,
    EntityTarget,
    FindOptionsWhere,
    Repository,
    ObjectLiteral,
  } from 'typeorm';
  
  export class BaseRepository<T extends ObjectLiteral> {
    constructor(
      protected readonly dataSource: DataSource,
      private readonly entity: EntityTarget<T>,
    ) {}
  
    private get repo(): Repository<T> {
      return this.dataSource.getRepository(this.entity);
    }
  
    async findAll(): Promise<T[]> {
      return await this.repo.find();
    }
  
    async findOne(id: number): Promise<T | null> {
      return await this.repo.findOne({
        where: { id } as any,
      });
    }
  
    async create(data: DeepPartial<T>): Promise<T> {
      const entity = this.repo.create(data);
      return await this.repo.save(entity);
    }
  
    async update(id: number, data: DeepPartial<T>): Promise<T> {
      const updatedEntity = { ...(data as T), id } as T;
      return await this.repo.save(updatedEntity);
    }
  
    async delete(id: number): Promise<void> {
      await this.repo.delete(id);
    }
  }
  