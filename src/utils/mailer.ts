// test server
import nodemailer, { SendMailOptions } from "nodemailer";
import config from "config";
import log from "./logger";

// get user credentials
// const createTestCreds = async () => {
//   const credentials = await nodemailer.createTestAccount();
//   console.log({ credentials });
// };

// createTestCreds();

// this function is to be called inside the user controller
const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>("smtp");

// this creates a new transporter when the application starts
const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, "Error sending email");
      return;
    }
    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};

export default sendEmail;
