import { Module } from "@nestjs/common";
import { InqueryModule } from "../modules/faraboom/inquery.module";
import { InqueryController } from "./controllers/faraboom.controller";

@Module({
    imports: [InqueryModule],
    controllers:[InqueryController]
})

export class InqueryCoreModule{}