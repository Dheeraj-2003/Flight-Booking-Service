import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBooking1744743352339 implements MigrationInterface {
    name = 'AddBooking1744743352339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."booking_status_enum" AS ENUM('booked', 'cancelled', 'initiated', 'pending')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "flightId" integer NOT NULL, "userId" integer NOT NULL, "noOfSeats" integer NOT NULL DEFAULT '1', "status" "public"."booking_status_enum" NOT NULL DEFAULT 'initiated', "totalCost" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
    }

}
