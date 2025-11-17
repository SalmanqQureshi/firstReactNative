import CryptoJS from 'crypto-js';
import { Server } from '../../config';
export const getCryptoToken = (
    clientId = Server.crypto.TOKEN,
) => {
    var key = CryptoJS.enc.Utf8.parse(Server.crypto.AES_SECRET);
    var iv = CryptoJS.enc.Utf8.parse(Server.crypto.AES_IV);
    var cipher_text = CryptoJS.AES.encrypt(clientId, key, { iv: iv }).toString();
    console.info(`Crypto clientId={${clientId}} ciphertext={${cipher_text}}`);
    console.info('Server==============',Server);
    return cipher_text;
};