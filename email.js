import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const mail = (status) => ({
  from: process.env.EMAIL,
  to: process.env.TARGET_EMAIL,
  subject: 'Border Queue Change',
  text: `Your queue status has been changed to ${JSON.stringify(status)}`
});

export const sendEmail = (status) => {
  transport.sendMail(mail(status), (error, info) => {
    if (error) {
      console.error('Email error:', error.message);
    } else {
      console.log('Email sent:', info.response);
    }
  })
}
