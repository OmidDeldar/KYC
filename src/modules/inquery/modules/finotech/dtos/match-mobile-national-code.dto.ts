import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Allow } from "class-validator";

export class MatchedMobileNationalCodeDto {
    @ApiHideProperty()
    @Allow()
    trackId?: string

    @ApiProperty()
    @Allow()
    mobile: string

    @ApiProperty()
    @Allow()
    nationalCode: string

    @ApiHideProperty()
    @Allow()
    version?: number

}