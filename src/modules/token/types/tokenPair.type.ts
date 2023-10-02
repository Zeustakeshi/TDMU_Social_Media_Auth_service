export type TokenPairType = {
    accessToken: Token;
    refreshToken: Token;
};

export type Token = {
    value: string;
    expiresIn: string;
};
