import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MakePaymentDto } from './dto/make-payment.dto';

@Controller('booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createBooking(@Body() data:CreateBookingDto){
        return this.bookingService.createBooking(data);
    }

    @Post('/payment')
    @HttpCode(HttpStatus.OK)
    async makePayment(@Body() data:MakePaymentDto){
        return this.bookingService.makePayment(data);
    }
}
