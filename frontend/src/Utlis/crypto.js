import CryptoJS from "crypto-js";

const SECRET_KEY = "chatly-key"; // TODO: use env or per-user key in real app

export function encryptMessage(text) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decryptMessage(encryptedText) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "[Unable to decrypt]";
  }
}
