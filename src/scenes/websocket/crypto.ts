export const CRYPTO_KEY = 75;

export const xorCipher = (input: string, key: number): string => {
    let output = '';
    for (let i = 0; i < input.length; i++) {
        output += String.fromCharCode(input.charCodeAt(i) ^ key);
    }
    return output;
}
