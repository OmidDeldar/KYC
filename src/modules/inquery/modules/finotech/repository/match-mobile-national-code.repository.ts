import { AbstractRepositoryClass } from "src/common/abstract/abstract.repository.class";
import { HandlerService } from "src/utility/handler/handler.service";
import { DataSource, FindOneOptions, QueryRunner } from "typeorm";
import { CreateMatchMobileNationalCodeDto } from "../dtos/create-match-mobile-national-code";
import { MatchMobileNationalCodeEnt } from "../entities/match-mobile-national-code.entity";

export class MatchMobileNationalCodeRepo extends AbstractRepositoryClass<
MatchMobileNationalCodeEnt,
CreateMatchMobileNationalCodeDto,
CreateMatchMobileNationalCodeDto
>{
    constructor(dataSource: DataSource, handlerService: HandlerService){
        super(dataSource, handlerService)
    }

    _findOneEntity(searchDto: string, options?: FindOneOptions<any>): Promise<MatchMobileNationalCodeEnt> {
        throw new Error("Method not implemented.");
    }
    async _createEntity(createDto: CreateMatchMobileNationalCodeDto, query?: QueryRunner): Promise<MatchMobileNationalCodeEnt> {
        const matchMobileNationalCodeEnt = new MatchMobileNationalCodeEnt()
        matchMobileNationalCodeEnt.mobile = createDto.mobile
        matchMobileNationalCodeEnt.nationalCode = createDto.nationalCode
        matchMobileNationalCodeEnt.responseCode = createDto.responseCode
        matchMobileNationalCodeEnt.smsSent = createDto.smsSent
        matchMobileNationalCodeEnt.status = createDto.status
        matchMobileNationalCodeEnt.trackId =createDto.trackId
        if(query) return await query.manager.save(matchMobileNationalCodeEnt)
        return await this.dataSource.manager.save(matchMobileNationalCodeEnt);
    }
    _updateEntity(entity: MatchMobileNationalCodeEnt, updateDto: CreateMatchMobileNationalCodeDto, query?: QueryRunner): Promise<MatchMobileNationalCodeEnt> {
        throw new Error("Method not implemented.");
    }
    _deleteEntity(entity: MatchMobileNationalCodeEnt, query?: QueryRunner): Promise<MatchMobileNationalCodeEnt> {
        throw new Error("Method not implemented.");
    }
}