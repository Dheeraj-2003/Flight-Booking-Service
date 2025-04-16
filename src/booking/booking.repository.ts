import { BaseRepository } from "src/common/repositories/base.repository";
import { Booking } from "./booking.entity";
import { DataSource, DeepPartial, EntityManager } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class BookingRepository extends BaseRepository<Booking>{
    constructor(dataSource: DataSource) {
        super(dataSource,Booking);
    }

    async createBooking(data: Partial<Booking>, manager?: EntityManager) : Promise<Booking>{
        const repo = manager ? manager.getRepository(Booking) : this.dataSource.getRepository(Booking);
        const booking = repo.create(data);
        return await repo.save(booking);
    }

    async findOne(id: number, manager?: EntityManager): Promise<Booking> {
        const repo = manager ? manager.getRepository(Booking) : this.dataSource.getRepository(Booking);       
        const booking = await repo.findOne({
          where: { id } as any,
        });
        if(!booking){
            throw new NotFoundException(`Booking with id ${id} not found`);
        }
        return booking;
    }

    async updateBooking(id: number, data: Partial<Booking>, manager?: EntityManager): Promise<void> {
        const repo = manager ? manager.getRepository(Booking) : this.dataSource.getRepository(Booking); 
        const response  = await repo.update(id,data);
        if(response.affected == 0) throw new NotFoundException();
      }
}