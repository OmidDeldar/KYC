export class MatchMobileNationaCodeResponse {
    responseCode: string;
    trackId: string;
    result: MatchMobileNationalCodeResult;
   status: string
   error?:any
}

export class MatchMobileNationalCodeResult {
    smsSent: boolean
}