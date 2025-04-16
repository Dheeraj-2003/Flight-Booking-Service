import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import { DataSource } from 'typeorm';
import axios from 'axios';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './booking.entity';
import { BOOKING_STATUS } from 'src/common/enum';
import { MakePaymentDto } from './dto/make-payment.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class BookingService {
    constructor(private readonly bookingRepository:BookingRepository, private readonly dataSource: DataSource){}

    async createBooking(data:CreateBookingDto){
        const queryRunner =  this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const response = await axios.get(`http://localhost:3000/api/flight/${data.flightId}`);
            const flightData = response.data;
            if(data.noOfSeats > flightData.data.totalSeats){
                throw new ConflictException('Seats not available')
            }
            const billingAmount = flightData.data.price * data.noOfSeats;
            const bookingPayload = {...data, totalCost: billingAmount};
            const booking = await this.bookingRepository.createBooking(bookingPayload, queryRunner.manager);

            await axios.patch(`http://localhost:3000/api/flight/${data.flightId}/seats`, {
                seats: data.noOfSeats,
            })

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw(error)
        } finally {
            await queryRunner.release();
        }
    }

    async makePayment(data: MakePaymentDto) : Promise<void> {
        const queryRunner =  this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const bookingDetails = await this.bookingRepository.findOne(data.bookingId, queryRunner.manager);
            if(bookingDetails.status == BOOKING_STATUS.CANCELLED){
                throw new BadRequestException('Booking was cancelled');
            }
            const bookingTime = bookingDetails.created_at.getTime();
            const currentTime = Date.now();
            if(currentTime - bookingTime > 1000*60*10 + 5.5*60*60*1000){
                await this.cancelBooking(data.bookingId);
                throw new BadRequestException('Booking has expired');
            }
            if(bookingDetails.totalCost != data.totalCost){
                throw new ConflictException('The amount of payment doesnt match');
            }
            if(bookingDetails.userId != data.userId){
                throw new ConflictException('The user corresponding to booking doesnt match');
            }

            //assuming payment was successful
            await this.bookingRepository.updateBooking(data.bookingId,{status:BOOKING_STATUS.BOOKED}, queryRunner.manager);
            await queryRunner.commitTransaction();

        } catch (error) {
            console.log(error)
            await queryRunner.rollbackTransaction();
            throw(error)
        } finally {
            queryRunner.release();
        }
    }

    async cancelBooking(bookingId: number): Promise<void>{
        const queryRunner =  this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const bookingDetails = await this.bookingRepository.findOne(bookingId, queryRunner.manager);
            if(bookingDetails.status == BOOKING_STATUS.CANCELLED){
                await queryRunner.commitTransaction();
                return;
            }

            await axios.patch(`http://localhost:3000/api/flight/${bookingDetails.flightId}/seats`, {
                seats: bookingDetails.noOfSeats,
                dec: false,
            });

            await this.bookingRepository.updateBooking(bookingId,{status:BOOKING_STATUS.CANCELLED}, queryRunner.manager);
            await queryRunner.commitTransaction();

        } catch (error) {
            queryRunner.rollbackTransaction();
            throw(error);
        } finally{
            queryRunner.release();
        }
    }

    @Cron('*/10 * * * *')
    async cancelOldBookings(){
        try {
            const oldBookings = await this.bookingRepository.cancelOldBookings();
        } catch (error) {
            throw(error)
        }
    }
}
