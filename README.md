

## DEMO

```js

// step1: constructor(aesKey, coprId, token)
let aes = new Aes('1234567890123456789012345678901234567890123', 'dinge0e69ed313daa460', '123456');

// step2: encode(encodeString, timestamp, nonceString);
let encoded = aes.encode('success', 1500957302881, 'KOHjp9ss');
console.log(encoded);

// step3: decode(decodeString, timestamp, nonceString, decodeStringSignature)
let parsed = aes.decode(encoded.encrypt, encoded.timeStamp, encoded.nonce, encoded.msg_signature);
console.log(parsed)


```