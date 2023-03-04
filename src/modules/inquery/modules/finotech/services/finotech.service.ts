import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { LOADIPHLPAPI } from 'dns';
import { url } from 'inspector';
import { HandlerError } from 'src/common/class/handler.error';
import { AxiosRequestFailed } from '../custom-exception/custom-exception';
import { ConfirmRequestTokenSmsDto } from '../dtos/confirm-request-token-sms.dto';
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
import { PreRequestTokenSmsDto } from '../dtos/pre-request-token-sms.dto';
import { ShebaDetailParam } from '../dtos/sheba-detail.dto';
import { VerifyRequestTokenSmsDto } from '../dtos/verify-request-token-sms.dto';
import { APiScopesEnum } from '../enums/scopes.enum';
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
import { baseUrl, getBankCartDetailApi, convertCartToShebaApi, getShebaDetailApi, convertCardToBankAccountApi, convertBankAccountToShebaApi, facilityWithNationalCode, banksInfo, preRequestTokenSms, verifyRequestTokenSms, confirmRequestTokenSms } from '../urls';



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
    try {
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

      const createCardDetailDto: CreateCardDetailDto = {
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
    } catch (error) {
      console.log(error.response.data.error);
    }


  }

  async convertCardToSheba(convertCardToShebaParam: ConvertCardToShebaParam): Promise<any> {
    try {
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
        card: String(convertCartToShebaData.result.card),
        deposit: convertCartToShebaData.result.deposit,
        depositOwners: convertCartToShebaData.result.depositOwners,
        depositStatus: String(convertCartToShebaData.result.depositStatus),
        iban: convertCartToShebaData.result.IBAN,
        trackId: convertCartToShebaData.trackId
      }

      await this.cardToShebaRepo.createEntity(createCardToShebaDto);
      return convertCartToShebaData.result
    } catch (error) {
      console.log(error.response.data.error);

    }

  }

  async getShebaDetail(shebaDetailParam: ShebaDetailParam): Promise<any> {
    try {
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
    } catch (error) {
      console.log(error.response.data.error);

    }

  }

  async convertCardToBankAccount(convertCardToBankAccountParam: ConvertCardToBankAccountParam): Promise<any> {
    try {
      const requestParam: ConvertCardToBankAccountParam = {
        card: convertCardToBankAccountParam.card,
        trackId: convertCardToBankAccountParam.trackId
      }
      console.log(convertCardToBankAccountParam);

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

    } catch (error) {
      console.log(error.response.data.error);

    }

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
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImV4aGFtcGEiLCJzY29wZXMiOlsiZmFjaWxpdHk6c21zLW5pZC12ZXJpZmljYXRpb246Z2V0Il0sImxpZmVUaW1lIjoiODY0MDAwMDAwIiwidHlwZSI6IkNPREUiLCJjcmVhdGlvbkRhdGUiOiIxNDAxMTIxMzE0MzIxMCIsInVzZXJJZCI6IjA5MjU3ODUxNjQiLCJhdXRoX3R5cGUiOiJTTVMiLCJyZWZyZXNoVG9rZW4iOiJuVUs1Y3F2OVlyRmFIUXFxOFdXM0lCamhnQ0h6SDRCYkowY2ZuT1ZYbXp0NTZwRTBEbWthTE1Hc2FuY2VBc0lSS3VEU0g1YWhlbWxFcFZBMFI0Vk5SZ2FtNnRINnpEMzFubkR2SXU3Um1JTTlJUW5JaE50RjZ3OXcxZGl5RlNOcXZ5eWo1RmNyeG1oR0dmeTFyNjNHcmI0NzBrVzR2TVluY0RoT1hrZkc5amYyU2ZYNVo0SWlJUlFQSXVzaDJwdXdiQWxQWmhnaUpwd2E4b3J3eU9JVEw4ZU40QXduSVIyd0JTSXhWZVk2NmNodXFkOGdzS1UwekdzblNNejNhc1NKIiwiYmFuayI6IjA2MiIsImlhdCI6MTY3NzkyNzczMCwiZXhwIjoxNjc4NzkxNzMwfQ.b7im9tljxK8x-MkYQ52yezvuIZZ_MEItOj67W7cp9D89V0Ir8NKwak3-KjMJEg-CpTrlcecIf0k1cdVNn1RPaCbY7wJyvebPWxmCUh3BMya6FDK58EjnHFSwvgoqgn-yXmXUAO41838CGmXF-253TA0sNf-jZncL9O9eNTmuvd_qQ11F4Y8fQQxBD8vRAuplXlwnbbIQ_6I1wo4aoMa5mgBxdoW3ynpxyDPu0fxkgwz8VyuS-IW8fLtUGJabU25P13vRD2ALy2EM0VQ0d2BuULANU8o92fM7DU6aelzkk_LKiYmdZTOqQoy6PFabMe41uQNJbNhxa2jns5v9ha9bHg`
      }
      const encodedString = Buffer.from(facilityWithNationalCodeDto.firstName).toString('base64')
      // const requestParam: FacilityWithNationalCodeDto = {
      //   birthDate: Buffer.from(facilityWithNationalCodeDto.birthDate).toString('base64'),
      //   fatherName: Buffer.from(facilityWithNationalCodeDto.fatherName).toString('base64'),
      //   firstName: Buffer.from(facilityWithNationalCodeDto.firstName).toString('base64'),
      //   fullName: Buffer.from(facilityWithNationalCodeDto.fullName).toString('base64'),
      //   gender: Buffer.from(facilityWithNationalCodeDto.gender).toString('base64'),
      //   lastName: Buffer.from(facilityWithNationalCodeDto.lastName).toString('base64'),
      // }
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

      return request.data;
      
    } catch (error) {
      console.log(error.response.data.error);

    }

  }


  async preRequestTokenSms(mobile: string) {
    try {
      const requestHeader =
      {
        Content_type: 'application/json',
        Authorization: `Basic ${process.env.FINOTECH_AUTH_TOKEN}`
      }

      const requestParam: PreRequestTokenSmsDto = {
        auth_type: 'SMS',
        client_id: process.env.FINOTECH_CLIENT_ID,
        mobile: mobile,
        redirect_uri: 'https://exhampa.com/auth',
        response_type: 'code',
        scope: APiScopesEnum.FACILITYSMS,
      }



      const request = await axios({
        method: "GET",
        url: baseUrl + preRequestTokenSms,
        params: requestParam,
        headers: requestHeader
      })
      console.log(request.data);
      return request.data
    } catch (error) {
      console.log(error.response.data.error);
    }
  }

  async verifyRequestTokenSms(verifyRequestTokenSmsDto: VerifyRequestTokenSmsDto) {
    try {

      const requestHeader =
      {
        Content_type: 'application/json',
        Authorization: `Basic ${process.env.FINOTECH_AUTH_TOKEN}`
      }

      const request = await axios({
        headers: requestHeader,
        method: "POST",
        url: baseUrl + verifyRequestTokenSms,
        data: verifyRequestTokenSmsDto
      })

      return request.data

    } catch (error) {
      console.log(error.response.data.error);
    }
  }

  async confirmRequestTokenSms(code: string) {
    try {
      const requestHeader =
      {
        Content_type: 'application/json',
        Authorization: `Basic ${process.env.FINOTECH_AUTH_TOKEN}`
      }

      const confirmRequestTokenSmsDto: ConfirmRequestTokenSmsDto = {
        auth_type: "SMS",
        code: code,
        grant_type: "authorization_code",
        redirect_uri: "https://exhampa.com/auth"
      }

      const request = await axios({
        headers: requestHeader,
        url: baseUrl + confirmRequestTokenSms,
        data: confirmRequestTokenSmsDto,
        method: "POST"
      })

      return request.data
    } catch (error) {
      console.log(error.response.data.error);
    }
  }
}