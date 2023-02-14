import axios, { AxiosResponse } from 'axios';
import { baseUrl, getTokenApi } from './urls';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { APiScopesEnum } from './enums/scopes.enum';

@Injectable()
export class RequestToken {
    constructor(){
        this.generateToken()
    }

    private token: string;


    private set setToken(v: string) {
        this.token = v;
    }


    public get getToken(): string {
        return this.token
    }



    @Cron('* * */240 * * *')
    async generateToken() {
        try {
            
            const requestHeader =
            {
                Content_type: 'application/json',
                Authorization: `Basic ${process.env.FINOTECH_AUTH_TOKEN}`
            }

            const requestBody =
            {
                grant_type: "client_credentials",
                nid: "0872912558",
                scopes:
                    `${APiScopesEnum.CARDDETAILS},${APiScopesEnum.CARDTODEPOSIT},${APiScopesEnum.CARDTOIBAN},${APiScopesEnum.DEPOSITTOIBAN},${APiScopesEnum.IBANINQUIRY}`
            }

            const request = await axios({ method: "POST", url: baseUrl + getTokenApi, headers: requestHeader, data: requestBody });
            this.setToken = await request.data.result.value as string
            // console.log(this.token);
            // return request.data.result;
        } catch (error) {
            console.log('error =>>>>>>', error.response.data.error);
        }

    }
}