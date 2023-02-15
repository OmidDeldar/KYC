import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { LOADIPHLPAPI } from 'dns';
import { HandlerError } from 'src/common/class/handler.error';
import { AxiosRequestFailed } from '../custom-exception/custom-exception';
import { ConvertBankAccountToShebaParam } from '../dtos/convert-card-sheba.dto';
import { ConvertCardToBankAccountParam } from '../dtos/convert-card-to-bank.dto';
import { ConvertCardToShebaParam } from '../dtos/convert-card-to-sheba.dto';
import { CreateAccountToShebaDto } from '../dtos/create-account-to-sheba.dto';
import { CreateCardDetailDto } from '../dtos/create-card-detail.dto';
import { CreateCardtoAccountDto } from '../dtos/create-card-to-account.dto';
import { CreateCardToShebaDto } from '../dtos/create-card-to-sheba.dto';
import { CreateShebaDetailDto } from '../dtos/create-sheba-detail.dto';
import { FacilityWithNationalCodeDto } from '../dtos/facility-with-national-code.dto';
import { GetBankCardDetailDto } from '../dtos/get-card-bank-detail.dto';
import { ShebaDetailParam } from '../dtos/sheba-detail.dto';
import { BankCardDetailResponse } from '../interfaces/bank-card-detail.interface';
import { ConvertBankAccountToShebaResponse } from '../interfaces/convert-bank-sheba-response.interface';
import { ConvertCardToBankAccountResponse } from '../interfaces/convert-card-to-bank.interface';
import { IConvertCartToShebaParams } from '../interfaces/convert-card-to-sheba-param.interface';
import { ConvertCardToShebaResponse } from '../interfaces/convert-card-to-sheba-response.interface';
import { ShebaDetailParams } from '../interfaces/sheba-detail-param.interface';
import { ShebaDetailResponse } from '../interfaces/sheba-detail-response.interface';
import { AccountToShebaRepo } from '../repository/account-to-sheba.repository';
import { CardDetailRepo } from '../repository/card-detail.repository';
import { CardToAccountRepo } from '../repository/card-to-account.repository';
import { CardToShebaRepo } from '../repository/card-to-sheba.repository';
import { ShebaDetailRepo } from '../repository/sheba-detail.repository';
import { RequestToken } from '../request.token';
import { baseUrl, getBankCartDetailApi, convertCartToShebaApi, getShebaDetailApi, convertCardToBankAccountApi, convertBankAccountToShebaApi, facilityWithNationalCode, banksInfo } from '../urls';



@Injectable()
export class FinooService {
  constructor(
    private reqToken: RequestToken,
    private cardDetailRepo: CardDetailRepo,
    private accountToShebaRepo: AccountToShebaRepo,
    private cardToAccountRepo: CardToAccountRepo,
    private cardToShebaRepo: CardToShebaRepo,
    private shebaDetailRepo: ShebaDetailRepo
  ) {
  }
  async getBankCartDetail(getBankCardDetailDto: GetBankCardDetailDto): Promise<BankCardDetailResponse> {

    const requestHeader =
    {
      Authorization: `Bearer ${this.reqToken.getToken}`
    }

    const sendRequest = await axios({ method: "GET", url: baseUrl + getBankCartDetailApi + getBankCardDetailDto.card_number, headers: requestHeader })
    if (sendRequest.status !== HttpStatus.OK)
      throw new AxiosRequestFailed()

    const sendReuqestData: BankCardDetailResponse = sendRequest.data
    if (sendReuqestData.error)
      return sendReuqestData.error
    
    const createCardDetailDto: CreateCardDetailDto ={
      bankName: sendRequest.data.result.bankName,
      card: String(getBankCardDetailDto.card_number),
      description: sendRequest.data.result.description,
      doTime: sendRequest.data.result.doTime,
      name: sendRequest.data.result.name,
      result: sendRequest.data.result.result,
      status: sendRequest.data.status,
      trackId: sendRequest.data.trackId
    }

    await this.cardDetailRepo.createEntity(createCardDetailDto);

    return sendReuqestData
  }

  async convertCardToSheba(convertCardToShebaParam: ConvertCardToShebaParam): Promise<any> {
    const requestParam: IConvertCartToShebaParams = {
      card: convertCardToShebaParam.card,
      trackId: convertCardToShebaParam.trackId,
      version: 2
    }

    const requestHeader = { Authorization: `Bearer ${this.reqToken.getToken}` }

    const sendRequest = await axios({ method: "GET", url: baseUrl + convertCartToShebaApi, params: requestParam, headers: requestHeader })
    if (sendRequest.status !== HttpStatus.OK)
      throw new AxiosRequestFailed()

    const convertCartToShebaData: ConvertCardToShebaResponse = sendRequest.data
    if (convertCartToShebaData.error)
      return convertCartToShebaData.error

    const createCardToShebaDto: CreateCardToShebaDto = {
      bankName: convertCartToShebaData.result.bankName,
      card:  String(convertCartToShebaData.result.card),
      deposit:  convertCartToShebaData.result.deposit,
      depositOwners:  convertCartToShebaData.result.depositOwners,
      depositStatus:  String(convertCartToShebaData.result.depositStatus),
      iban: convertCartToShebaData.result.IBAN,
      trackId:  convertCartToShebaData.trackId
    }
    
    await this.cardToShebaRepo.createEntity(createCardToShebaDto);
    return convertCartToShebaData.result
  }

  async getShebaDetail(shebaDetailParam: ShebaDetailParam): Promise<any> {
    const requestParam: ShebaDetailParams = {
      iban: shebaDetailParam.iban,
      trackId: shebaDetailParam.trackId
    }

    const requestHeader = { Authorization: `Bearer ${this.reqToken.getToken}` }

    const sendRequest = await axios({ method: "GET", url: baseUrl + getShebaDetailApi, headers: requestHeader, params: requestParam })
    if (sendRequest.status !== HttpStatus.OK)
      throw new AxiosRequestFailed()

    const requestData: ShebaDetailResponse = sendRequest.data
    if (requestData.error)
      return requestData.error

    const name = JSON.stringify(sendRequest.data.result.depositOwners)
    const createShebaDetailDto: CreateShebaDetailDto = {
      bankName: requestData.result.bankName,
      deposit: requestData.result.deposit,
      depositComment: requestData.result.depositComment,
      depositDescription: requestData.result.depositDescription,
      depositOwners: requestData.result.depositOwners,
      depositStatus: requestData.result.depositStatus,
      errorDescription: requestData.result.errorDescription,
      iban: requestData.result.IBAN
    }
    await this.shebaDetailRepo.createEntity(createShebaDetailDto)
    
    return requestData.result
  }

  async convertCardToBankAccount(convertCardToBankAccountParam: ConvertCardToBankAccountParam): Promise<any> {
    const requestParam: ConvertCardToBankAccountParam = {
      card: convertCardToBankAccountParam.card,
      trackId: convertCardToBankAccountParam.trackId
    }

    const requestHeader = { Authorization: `Bearer ${this.reqToken.getToken}` }

    const sendRequest = await axios({ method: "GET", url: baseUrl + convertCardToBankAccountApi, headers: requestHeader, params: requestParam })
    if (sendRequest.status !== HttpStatus.OK)
      throw new AxiosRequestFailed()

    const requestData: ConvertCardToBankAccountResponse = sendRequest.data
    if (requestData.error)
      return requestData.error

    const createCardtoAccountDto: CreateCardtoAccountDto = {
      card: String(convertCardToBankAccountParam.card),
      deposit: requestData.result.deposit,
      description: requestData.result.description,
      doTime: requestData.result.doTime,
      name: requestData.result.name,
      providerCod: requestData.result.providerCod,
      result: requestData.result.result,
      trackId: requestData.trackId
    }
    
    await this.cardToAccountRepo.createEntity(createCardtoAccountDto);
    return requestData.result

  }

  async convertBankAccountToSheba(convertBankAccountToShebaParam: ConvertBankAccountToShebaParam): Promise<any> {
    try {
      const requestParam: ConvertBankAccountToShebaParam =
    {
      bankCode: convertBankAccountToShebaParam.bankCode,
      deposit: convertBankAccountToShebaParam.deposit,
      trackId: convertBankAccountToShebaParam.trackId
    }

    const requestHeader = { Authorization: `Bearer ${this.reqToken.getToken}` }

    const request = await axios({ method: "GET", url: baseUrl + convertBankAccountToShebaApi, headers: requestHeader, params: requestParam })
    if (request.status !== HttpStatus.OK)
      throw new AxiosRequestFailed()

    const requestData: ConvertBankAccountToShebaResponse = request.data
    if (requestData.error)
      return requestData.error
    
    const createAccountToShebaDto: CreateAccountToShebaDto = {
      accountStatus: request.data.result.accountStatus,
      bankCode: convertBankAccountToShebaParam.bankCode,
      bankName: requestData.result.bankName,
      deposit: requestData.result.deposit,
      depositOwners: String(requestData.result.depositOwners),
      iban: request.data.result.iban,
      status: requestData.status,
      trackId: requestData.trackId
    }

    await this.accountToShebaRepo.createEntity(createAccountToShebaDto);
    return requestData
    } catch (error) {
      console.log(error.response.data.error);
    }
    
  }

  async facilityWithNationalCode(facilityWithNationalCodeDto: FacilityWithNationalCodeDto) {
    try {
      const requestHeader = {
        Authorization: `Bearer ${this.reqToken.getToken}`
      }

      const requestParam: FacilityWithNationalCodeDto = {
        birthDate: facilityWithNationalCodeDto.birthDate,
        fatherName: facilityWithNationalCodeDto.fatherName,
        firstName: facilityWithNationalCodeDto.firstName,
        fullName: facilityWithNationalCodeDto.fullName,
        gender: facilityWithNationalCodeDto.gender,
        lastName: facilityWithNationalCodeDto.lastName,
      }

      const request = await axios({
        method: "GET", url: baseUrl + facilityWithNationalCode + facilityWithNationalCodeDto.national_code + '/sms/nidVerification',
        headers: requestHeader,
        params: requestParam
      })

    } catch (error) {
      console.log(error.response.data.error);

    }

  }

}