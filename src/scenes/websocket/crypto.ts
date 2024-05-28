import { getBooleanFromEnv } from "../../utils/booleanFromEnv";

export const CRYPTO_KEY = Number(process.env.VITE_ENCRYPTION_KEY);
export const isEncrypted = getBooleanFromEnv(process.env.VITE_ENCRYPTION_ENABLED);

// Base64 Encode Function
const base64Encode = (data: string): string => {
    return btoa(data);
}

    // Base64 Decode Function
const base64Decode = (data: string): string => {
    return atob(data);
}

const xorCipher = (input: string, key: number): string => {
  let output = "";
  for (let i = 0; i < input.length; i++) {
    output += String.fromCharCode(input.charCodeAt(i) ^ key);
  }
  return output;
};

// Encrypt Function (XOR + Base64)
export const encrypt = (input: string, key: number): string => {
  const encrypted = xorCipher(input, key);
  return base64Encode(encrypted);
};


// Decrypt Function (Base64 + XOR)
export const decrypt = (input: string, key: number): string => {
  const decoded = base64Decode(input);
  return xorCipher(decoded, key);
};

