import { BOOKING_STATUS } from "src/common/enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
export class Booking{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    flightId: number;

    @Column()
    userId: number;

    @Column({
        default: 1,
    })
    noOfSeats: number;

    @Column({
        type: 'enum',
        enum: BOOKING_STATUS,
        default: BOOKING_STATUS.INITIATED
    })
    status:BOOKING_STATUS;

    @Column()
    totalCost: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}