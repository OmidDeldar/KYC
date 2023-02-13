import { SchemaEntityEnum } from "src/common/enums/schema.entity.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema:SchemaEntityEnum.AUTH, name: "inquery_national_phone" })
export class InqueryNationalPhoneEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    national_code: string;

    @Column()
    phone_number: string;

    @Column()
    match: boolean;

    @Column({ nullable: true })
    alive: boolean;
}