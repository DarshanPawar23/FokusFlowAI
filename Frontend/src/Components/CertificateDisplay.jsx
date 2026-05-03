import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import certificateBg from "../assets/certificate-template.jpg";

const CertificateDisplay = ({
  studentName,
  courseName,
  certificateId,
  txId,
  issueDate
}) => {

  const certRef = useRef();

  const downloadCertificate = async () => {
    const canvas = await html2canvas(certRef.current, {
      useCORS: true,
      scale: 3
    });

    const link = document.createElement("a");
    link.download = `${certificateId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
   console.log("CERT DATA:", certificateId, txId, courseName);

  return (
    <div className="flex flex-col items-center space-y-6">

      <div
        ref={certRef}
        className="relative shadow-2xl"
        style={{
          width: "1100px",
          height: "750px",
          backgroundImage: `url(${certificateBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "Georgia, serif"
        }}
      >

        {/* Student Name */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "48px",
            fontWeight: "bold",
            color: "#222",
            textAlign: "center",
            width: "80%"
          }}
        >
          {studentName}
        </div>

        {/* Exam Title */}
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "24px",
            color: "#444",
            textAlign: "center",
            width: "80%"
          }}
        >
          has successfully completed <b>{courseName}</b>
        </div>

        {/* Bottom Details */}
        <div
          style={{
            position: "absolute",
            bottom: "90px",
            left: "100px",
            fontSize: "17px",
            color: "#111",
            lineHeight: "28px",
            width: "650px"
          }}
        >
          <div>
            <strong>Certificate ID:</strong> {certificateId}
          </div>

          <div style={{ wordBreak: "break-all" }}>
            <strong>Transaction ID:</strong> {txId}
          </div>

          <div>
            <strong>Issued On:</strong> {issueDate}
          </div>
        </div>

        {/* QR Code */}
        <div
          style={{
            position: "absolute",
            bottom: "90px",
            right: "110px"
          }}
        >
          <QRCodeCanvas
            value={`http://localhost:3000/api/users/verify/${certificateId}`}
            size={130}
          />
        </div>

      </div>

      <button
        onClick={downloadCertificate}
        className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition"
      >
        Download Certificate
      </button>

    </div>
  );
};

export default CertificateDisplay;
