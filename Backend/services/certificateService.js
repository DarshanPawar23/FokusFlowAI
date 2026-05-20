import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { generateQR } from "./qrService.js";

export const generateCertificatePDF = async ({
  fullName,
  courseName,
  certificateId
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 0
      });

      if (!fs.existsSync("certificates")) {
        fs.mkdirSync("certificates");
      }

      const fileName = `cert-${certificateId}.pdf`;
      const filePath = path.join("certificates", fileName);

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const templatePath = path.resolve("templates", "certificate.png");

      if (!fs.existsSync(templatePath)) {
        throw new Error("Template not found");
      }

      doc.image(templatePath, 0, 0, {
        width: doc.page.width,
        height: doc.page.height
      });

      const pageWidth = doc.page.width;

      doc
        .font("Helvetica-Bold")
        .fontSize(40)
        .fillColor("#022c60")
        .text(fullName.toUpperCase(), 0, 300, {
          align: "center",
          characterSpacing: 2
        });

      doc
        .font("Helvetica")
        .fontSize(16)
        .fillColor("#555")
        .text(
          "has successfully achieved certification for completing the course:",
          0,
          360,
          { align: "center" }
        );

      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor("#022c60")
        .text(courseName.toUpperCase(), 100, 395, {
          align: "center",
          width: pageWidth - 200
        });

      const qrData = `https://fokusflowai.com/verify/${certificateId}`;
      const qrImage = await generateQR(qrData);

      const qrSize = 70;
      const qrX = 110;
      const qrY = doc.page.height - 140;

      doc.image(qrImage, qrX, qrY, { width: qrSize });

      const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      const textX = qrX + qrSize + 20;

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#777")
        .text("Issued On:", textX, qrY + 10);

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#022c60")
        .text(date, textX + 75, qrY + 10);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#777")
        .text("Certificate ID:", textX, qrY + 28);

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#022c60")
        .text(certificateId.toUpperCase(), textX + 75, qrY + 28);

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);

    } catch (err) {
      console.error("PDF ERROR:", err);
      reject(err);
    }
  });
};