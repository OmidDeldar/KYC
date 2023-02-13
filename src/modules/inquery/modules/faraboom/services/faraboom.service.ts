import { HttpService } from "@nestjs/axios";
import { Injectable } from '@nestjs/common';
import { HandlerError } from "src/common/class/handler.error";
import { HandlerService } from "src/utility/handler/handler.service";
import { CreateInqueryBirthDto } from "../dtos/create-inquery-birth.dto";
import { CreateInqueryShebaDto } from "../dtos/create-inquery-sheba.dto";
import InqueryShebaUtility from "../utility/inquery-accounting.utility";
import InqueryMobileUtility from "../utility/inquery-mobile.utility";
import InquiryNationalUtility from "../utility/inquery-national.utility";
import { CreateInqueryMobileDto } from './../dtos/create-inquery-mobile.dto';

@Injectable()
export class FaraboomService {
    inquiryNationalUtility: InquiryNationalUtility
    inqueryAccountingUtility: InqueryShebaUtility
    inqueryMobileUtility: InqueryMobileUtility
    constructor(private handlerService: HandlerService,
        private httpService: HttpService,
    ) {
        this.inquiryNationalUtility = new InquiryNationalUtility(httpService)
        this.inqueryAccountingUtility = new InqueryShebaUtility(httpService)
        this.inqueryMobileUtility = new InqueryMobileUtility(httpService)
    }

    async inquiryShebaFaraboom(createInquerySheba: CreateInqueryShebaDto) {
        try {
            return await this.inqueryAccountingUtility.inquiryShebaFaraboom(createInquerySheba);
        } catch (e) {
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400("FA", result);
        }
    }

    async inquiryNationalFaraboom(createInqueryBirthDto: CreateInqueryBirthDto) {
        try {
            return await this.inquiryNationalUtility.inquiryNationalFaraboom(createInqueryBirthDto);
        } catch (e) {
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400("FA", result);
        }
    }


    async inquiryMobileFaraboom(CreateInqueryMobileDto: CreateInqueryMobileDto) {
        try {
            return await this.inqueryMobileUtility.inquiryMobileFaraboom(CreateInqueryMobileDto);
        } catch (e) {
            const result = await HandlerError.errorHandler(e);
            await this.handlerService.handlerException400("FA", result);
        }
    }
}
