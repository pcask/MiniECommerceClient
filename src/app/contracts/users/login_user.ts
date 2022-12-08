export class Login_User {
    token: Token;
}

export class Token {
    accessToken: string;
    aTokenEndDate: Date;
    refreshToken: string;
    rTokenEndDate: Date;
}