import _ from 'lodash';
import chai from 'chai';
import nodemailer from 'nodemailer';

// Classes
import { Kernel } from '@system/kernels/kernel';

// SMTP 
const transporter = nodemailer.createTransport({
    host: Bun.env.SMTP_HOST,
    port: _.toInteger(Bun.env.SMTP_PORT || '587'),
    secure: Bun.env.SMTP_SECURE === 'true',
    requireTLS: Bun.env.SMTP_SECURE_TLS === 'true',
    auth: {
        user: Bun.env.SMTP_USER,
        pass: Bun.env.SMTP_PASS,
    }
});

// Implementation
export class KernelSmtp {
    constructor(private readonly kernel: Kernel) {}

    async startup() {}
    async cleanup() {}

    async send(mail: _.Dictionary<any>) {
        console.warn('SMTP:', mail);

        chai.expect(mail).property('from').string;
        chai.expect(mail).property('to').string;
        chai.expect(mail).property('subject').string;

        // Send it
        await transporter.sendMail(mail);
    }
}
