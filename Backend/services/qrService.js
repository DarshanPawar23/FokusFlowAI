import QRCode from "qrcode"

export const generateQR = async(title)=>{
    try{
    return await QRCode.toDataURL(title,{
        errorCorrectionLevel : 'M',
        margin :1,
        color :{
            dark: "#022c60", // Match the certificate blue!
            light: "#ffffff"
        }
    });
}
catch(err){
  console.error(err);
    throw err;
}
}