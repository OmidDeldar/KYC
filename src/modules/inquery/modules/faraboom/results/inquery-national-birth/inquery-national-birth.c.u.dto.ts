import { ApiProperty } from "@nestjs/swagger";
import { InqueryNationalBirthEntity } from "../../entities/inquery-national-birth.entity";


export class InqueryBirthCUDto {

    @ApiProperty()
    id: string

    @ApiProperty()
    national_code: string

    @ApiProperty()
    first_name: string

    @ApiProperty()
    last_name: string

    @ApiProperty()
    father_name: string

    @ApiProperty()
    birth_date: string

    @ApiProperty()
    match: boolean

    @ApiProperty()
    alive: boolean


    constructor(init?: Partial<InqueryNationalBirthEntity>) {
        this.id = init.id;
        this.national_code = init.national_code;
        this.first_name = init.first_name;
        this.last_name = init.last_name;
        this.father_name = init.father_name;
        this.birth_date = init.birth_date;
        this.match = init.match;
        this.alive = init.alive;
    }


}

