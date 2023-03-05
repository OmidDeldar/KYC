import { SchemaEntityEnum } from "src/common/enums/schema.entity.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: SchemaEntityEnum.AUTH, name: "facility-national-code" })
export class FacilityNationalCodeEnt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    birthDate: string

    @Column({nullable: true})
    fullName: string

    @Column({nullable: true})
    firstName: string

    @Column({nullable: true})
    lastName: string

    @Column({nullable: true})
    gender: string

    @Column({nullable: true})
    fatherName: string

    @Column()
    national_code: string

    @Column()
    deathStatus: string

    @Column({nullable: true})
    fullNameSimilarity: number

    @Column({nullable: true})
    firstNameSimilarity: number

    @Column({nullable: true})
    lastNameSimilarity: number


}