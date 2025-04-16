import { IsInt } from "@nestjs/class-validator";
import { IsNotEmpty } from "class-validator";

export class CreateBookingDto{
    @IsInt()
    @IsNotEmpty()
    flightId:number;

    @IsInt()
    @IsNotEmpty()
    userId:number;

    @IsInt()
    @IsNotEmpty()
    noOfSeats:number;
}