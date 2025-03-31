import { gamePublicKey } from "@/configs/config";

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\r\n|\n|\r/gm, "");

  const binaryString = atob(pemContents);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const generateSecurePayload = async (data: Record<string, unknown>) => {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2, 15);

  const payload = {
    ...data,
    timestamp,
    nonce,
  };

  const payloadString = JSON.stringify(payload);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(payloadString);

  const publicKeyBuffer = pemToArrayBuffer(gamePublicKey);

  const publicKey = await crypto.subtle.importKey(
    "spki",
    publicKeyBuffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    dataBuffer
  );
  
  const encryptedPayload = arrayBufferToBase64(encryptedBuffer);

  return {
    payload: encryptedPayload,
  };
};
