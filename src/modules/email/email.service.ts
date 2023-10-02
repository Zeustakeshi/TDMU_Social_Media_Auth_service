import configs from '@/configs/configuration';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IEmailService } from './email.service.interface';

@Injectable()
export class EmailService implements IEmailService {
    constructor(private readonly mailerService: MailerService) {}

    public async sendEmail(
        verifyToken: string,
        userId: string,
        mailTo: string,
    ) {
        await this.mailerService.sendMail({
            to: mailTo,
            subject: 'Email kích hoạt tài khoản mạng xã hội TDMU',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Kích Hoạt Tài Khoản</title>
                </head>
                <body>
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1style="color: #4CAF50; font-weight:600;">Xin chào!</h1>
                        <p>Cảm ơn bạn đã đăng ký tài khoản tại trang web của chúng tôi. Để kích hoạt tài khoản của bạn, vui lòng nhấp vào liên kết bên dưới:</p>
                        <p><a href="${configs.mailVerifyUrl}?token=${verifyToken}&userId=${userId}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Kích hoạt tài khoản</a></p>
                        <p>Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.</p>
                        <p>Xin cảm ơn!</p>
                    </div>
                </body>
                </html>
            `,
        });
    }
}
