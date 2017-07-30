const aesjs = require('aes-js');
const assert = require('assert');
const crypto = require('crypto');
const bufferpack = require('bufferpack');

// aes document: https://www.npmjs.com/package/aes-js

function sign(token, timestamp, nonce, msg_encrypt) {
    let array = [token, timestamp, nonce, msg_encrypt];
    array = array.sort();
    let str = array.join('');

    let sha1 = crypto.createHash('sha1');
    sha1.update(str, 'utf8');
    let signature = sha1.digest('hex');

    return signature;
}


function customPadding(buffer) {
    let BLOCK_SIZE = 32;
    let amountToPad = BLOCK_SIZE - (buffer.length % BLOCK_SIZE);
    if (amountToPad == 0) {
        amountToPad = BLOCK_SIZE;
    }
    let padChr = String.fromCharCode(amountToPad);
    let tmp = '';
    for (let i = 0; i < amountToPad; i++) {
        tmp += padChr;
    }
    let padBuffer = new Buffer(tmp);
    return padBuffer;
}

function pack(number) {
    let value = bufferpack.pack('I', [number]);
    return value;
}

function unpack(buffer) {
    // let buffer = new Buffer(chars, 'latin1');
    let origin = bufferpack.unpack('I', buffer)
    return origin[0];
}


class Aes {

    constructor(_aesKey, corpId, token) {
        let aesKey = _aesKey;
        if (_aesKey.length === 43) {
            aesKey = Buffer.from(_aesKey + "=", 'base64');
        }

        let iv = aesKey.slice(0, 16);
        token = token || '123456';

        this.corpId = corpId;
        this.token = token;
        this.aesKey = aesKey;
        this.iv = iv;
    }

    decode(encrypt, timestamp, nonce, signature) {
        // 验签
        let sig = sign(this.token, timestamp, nonce, encrypt);
        assert(sig === signature, 'signature匹配正确');
        let decodedStr = this._decode(encrypt);
        // 获得内容字符长度
        let len = unpack(decodedStr.slice(16, 20));
        // 根据长度获取内容
        let decrypt = decodedStr.slice(20, 20 + len);
        decrypt = decrypt.toString('utf8');

        try {
            let jsonParsed = JSON.parse(decrypt);
            return jsonParsed
        } catch (e) {
            return decrypt;
        }

    }

    encode(encodeStr = 'success', msg_timestamp = Date.now(), msg_nonce = 'KOHjp9ss') {

        let concatStr = '1234567890123456' + pack(encodeStr.length).toString('latin1') + encodeStr + this.corpId;

        let encrypt = this._encode(new Buffer(concatStr));
        let msg_signature = sign(this.token, msg_timestamp, msg_nonce, encrypt);

        let result = {
            "msg_signature": msg_signature,
            "timeStamp": msg_timestamp,
            "nonce": msg_nonce,
            "encrypt": encrypt
        };
        return result;
    }

    _encode(buffer) {
        let padBuffer = customPadding(buffer);
        buffer = Buffer.concat([buffer, padBuffer]);
        let aesCbc = new aesjs.ModeOfOperation.cbc(this.aesKey, this.iv);
        // decryptedBytes 非标准buffer
        let encryptedBytes = aesCbc.encrypt(buffer);
        let encryptedHex = new Buffer(encryptedBytes).toString('base64');
        return encryptedHex;
    }

    _decode(b64string) {
        let buffer = Buffer.from(b64string, 'base64');
        let aesCbc = new aesjs.ModeOfOperation.cbc(this.aesKey, this.iv);
        // decryptedBytes 非标准buffer
        let decryptedBytes = aesCbc.decrypt(buffer);
        let decryptedBuffer = new Buffer(decryptedBytes);
        return decryptedBuffer;
    }

}

module.exports = Aes;



