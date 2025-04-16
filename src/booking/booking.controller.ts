import { BadRequestException, Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MakePaymentDto } from './dto/make-payment.dto';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    inMemDB = {};

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(ValidationPipe)
    async createBooking(@Body() data:CreateBookingDto){
        return this.bookingService.createBooking(data);
    }

    @Post('/payment')
    @HttpCode(HttpStatus.OK)
    @UsePipes(ValidationPipe)
    async makePayment(@Body() data:MakePaymentDto, @Headers('x-idempotent-key') idempotentKey: string){
        if(!idempotentKey){
            throw new BadRequestException('Idempotent Key is missing')
        } else if(this.inMemDB['idempotentKey'] == idempotentKey) { 
            throw new BadRequestException('Cannot retry on successful payments')
        }
        try {
            await this.bookingService.makePayment(data);
            this.inMemDB['idempotentKey'] = idempotentKey;
        } catch (error) {
            throw(error)
        }
    }
}
