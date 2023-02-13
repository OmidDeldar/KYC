import { SchemaEntityEnum } from "src/common/enums/schema.entity.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: SchemaEntityEnum.AUTH, name: "inquery_national_birth" })
export class InqueryNationalBirthEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    national_code: string

    @Column({ nullable: true })
    first_name: string

    @Column({ nullable: true })
    last_name: string

    @Column({ nullable: true })
    father_name: string

    @Column()
    birth_date: string

    @Column()
    match: boolean

    @Column({ nullable: true })
    alive: boolean
}