import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthService {
// KEYS
private apiKeys: string[] = [
'ca03na188ame03u1d78620de67282882a84',
];
validateApiKey(apiKey: string) {
return this.apiKeys.find(apiK => apiKey === apiK);
}
}