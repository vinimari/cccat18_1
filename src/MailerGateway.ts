export default interface IMailerGateway {
  send(recipient: string, subject: string, message: string): Promise<void>;
}

export class MailerGatewayMemory implements IMailerGateway {
  async send(
    recipient: string,
    subject: string,
    message: string
  ): Promise<void> {
    console.log(recipient, subject, message);
  }
}
