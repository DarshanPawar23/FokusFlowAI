import nodemailer from "nodemailer";

export const sendCertificateMail = async (email, filePath) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    await transporter.sendMail({
        from: `"FokusFlow AI" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🎉 Your Course Certificate",
        html: `
      <h2>Congratulations 🎉</h2>
      <p>Your certificate is attached.</p>
      <p>Keep learning 🚀</p>
    `,
        attachments: [
            {
                filename: "certificate.pdf",
                path: filePath
            }
        ]
    })
}