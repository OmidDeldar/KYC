import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { AxiosRequestFailed } from '../custom-exception/custom-exception';
import { ConvertBankAccountToShebaParam } from '../dtos/convert-card-sheba.dto';
import { ConvertCardToBankAccountParam } from '../dtos/convert-card-to-bank.dto';
import { ConvertCardToShebaParam } from '../dtos/convert-card-to-sheba.dto';
import { GetBankCardDetailDto } from '../dtos/get-card-bank-detail.dto';
import { ShebaDetailParam } from '../dtos/sheba-detail.dto';
import { BankCardDetailResponse } from '../interfaces/bank-card-detail.interface';
import { ConvertBankAccountToShebaResponse } from '../interfaces/convert-bank-sheba-response.interface';
import { ConvertCardToBankAccountResponse } from '../interfaces/convert-card-to-bank.interface';
import { IConvertCartToShebaParams } from '../interfaces/convert-card-to-sheba-param.interface';
import { ConvertCardToShebaResponse } from '../interfaces/convert-card-to-sheba-response.interface';
import { ShebaDetailParams } from '../interfaces/sheba-detail-param.interface';
import { ShebaDetailResponse } from '../interfaces/sheba-detail-response.interface';
import { requestToken } from '../request.token';
import { baseUrl, getBankCartDetailApi, convertCartToShebaApi, getShebaDetailApi, convertCardToBankAccountApi, convertBankAccountToShebaApi } from '../urls';



@Injectable()
export class FinooService {

  async getBankCartDetail(getBankCardDetailDto:GetBankCardDetailDto):Promise<BankCardDetailResponse>
  {
    const requestHeader=
      {
        Authorization:`Bearer ${requestToken}`
      }

    const sendRequest=await axios({method:"GET",url:baseUrl+getBankCartDetailApi+getBankCardDetailDto.card_number,headers:requestHeader})
    if (sendRequest.status!==HttpStatus.OK)
      throw new AxiosRequestFailed()

    const sendReuqestData:BankCardDetailResponse=sendRequest.data
    if (sendReuqestData.error)
      return sendReuqestData.error

    return sendReuqestData
  }

  async convertCardToSheba(convertCardToShebaParam:ConvertCardToShebaParam):Promise<any>
  {
    const requestParam:IConvertCartToShebaParams= {
      card:convertCardToShebaParam.card,
      trackId:convertCardToShebaParam.trackId,
      version:2 }

      const requestHeader= {Authorization:`Bearer ${requestToken}`}

      const sendRequest=await axios({method:"GET",url:baseUrl+convertCartToShebaApi,params:requestParam,headers:requestHeader})
    if (sendRequest.status!==HttpStatus.OK)
      throw new AxiosRequestFailed()

    const convertCartToShebaData:ConvertCardToShebaResponse=sendRequest.data
    if (convertCartToShebaData.error)
      return convertCartToShebaData.error

    return convertCartToShebaData.result
  }

  async getShebaDetail(shebaDetailParam:ShebaDetailParam):Promise<any>
  {
    const requestParam:ShebaDetailParams={
      iban:shebaDetailParam.iban,
    trackId:shebaDetailParam.trackId
    }

    const requestHeader= {Authorization:`Bearer ${requestToken}`}

    const sendRequest=await axios({method:"GET",url:baseUrl+getShebaDetailApi,headers:requestHeader,params:requestParam})
    if (sendRequest.status!==HttpStatus.OK)
      throw new AxiosRequestFailed()

    const requestData:ShebaDetailResponse=sendRequest.data
    if (requestData.error)
      return  requestData.error

    return requestData.result
  }

  async convertCardToBankAccount(convertCardToBankAccountParam:ConvertCardToBankAccountParam):Promise<any>
  {
    const requestParam:ConvertCardToBankAccountParam={
        card:convertCardToBankAccountParam.card,
        trackId:convertCardToBankAccountParam.trackId}

    const requestHeader= {Authorization:`Bearer ${requestToken}`}

    const sendRequest=await axios({method:"GET",url:baseUrl+convertCardToBankAccountApi,headers:requestHeader,params:requestParam})
    if (sendRequest.status!==HttpStatus.OK)
      throw new AxiosRequestFailed()

    const requestData:ConvertCardToBankAccountResponse=sendRequest.data
    if (requestData.error)
      return requestData.error

    return requestData.result

  }

  async convertBankAccountToSheba(convertBankAccountToShebaParam:ConvertBankAccountToShebaParam):Promise<any> {
    const requestParam: ConvertBankAccountToShebaParam =
      {
        bank: convertBankAccountToShebaParam.bank,
        deposit: convertBankAccountToShebaParam.deposit,
        trackId: convertBankAccountToShebaParam.trackId
      }

    const requestHeader = { Authorization: `Bearer ${requestToken}` }

    const request=await axios({method:"GET",url:baseUrl+convertBankAccountToShebaApi,headers:requestHeader,params:requestParam})
    if (request.status!==HttpStatus.OK)
      throw new AxiosRequestFailed()

    const requestData:ConvertBankAccountToShebaResponse=request.data
    if (requestData.error)
      return requestData.error

    return requestData.result
  }

}