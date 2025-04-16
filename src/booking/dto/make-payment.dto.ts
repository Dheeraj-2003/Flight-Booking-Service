import { IsInt, IsNotEmpty } from "class-validator";

export class MakePaymentDto{
    @IsInt()
    @IsNotEmpty()
    bookingId: number;

    @IsInt()
    @IsNotEmpty()
    userId: number;

    @IsInt()
    @IsNotEmpty()
    totalCost: number;
}