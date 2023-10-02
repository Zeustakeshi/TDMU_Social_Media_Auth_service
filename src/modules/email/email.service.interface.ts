export interface IEmailService {
    /**
     *  Send email
     * @param verifyToken token using send with email verify
     * @param userId id of user form cache
     * @param mailTo
     */
    sendEmail(
        verifyToken: string,
        userId: string,
        mailTo: string,
    ): Promise<void>;
}
