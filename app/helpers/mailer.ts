import nodemailer from 'nodemailer';
import user from "@/app/models/userModel";
import bcryptjs from "bcryptjs";
import { use } from "react";

export const senEmail = async ({ email, emailType, username }: any) => {
  try {
    // create a hased token
    const hasedtoken = await bcryptjs.hash(username.toString(), 10);

    if (emailType === "VERIFY") {
      // send the user an email
      await user.findByIdAndUpdate(username, {
        verifyToken: hasedtoken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await user.findByIdAndUpdate(username, {
        forgotPasswordToken: hasedtoken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "406ea9dcaccdd3",
        pass: "****33d7",
      },
    });

    const mailOptions = {
        from: 'ag1741923@gmail.com',
        to: email,
        subject:
          emailType === "VERIFY"
            ? "Verify your email"
            : "Reset your password",
        html: `<p>Click <a href="${process.env.domain}/verifyemail?token=${hasedtoken}">here</a> to ${
          emailType === "VERIFY" ? "verify your email" : "reset your password"
        } or copy and paste the link below in your browser. <br /> ${
          process.env.NEXTAUTH_URL
        }/verifyemail?token=${hasedtoken}</p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;



  } catch (err: any) {
    throw new Error(err.message);
  }
};
