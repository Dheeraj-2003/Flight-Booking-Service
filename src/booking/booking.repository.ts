import { BaseRepository } from "src/common/repositories/base.repository";
import { Booking } from "./booking.entity";
import { DataSource, DeepPartial, EntityManager, LessThan, MoreThan } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { BOOKING_STATUS } from "src/common/enum";

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
    async cancelOldBookings(): Promise<void>{
        try {
            const time = new Date(Date.now()-5.5*60*60*1000-10*60*1000);
            const oldBookings = await this.dataSource.getRepository(Booking).createQueryBuilder('booking').update(Booking).set({
                status: BOOKING_STATUS.CANCELLED,
            }).where("created_at > :time AND status != :booked AND status != :cancelled", {time: time, booked: BOOKING_STATUS.BOOKED, cancelled: BOOKING_STATUS.CANCELLED }).execute()
        } catch (error) {
           throw(error)
        }
    }
}