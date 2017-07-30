const Aes = require("../")

let json = { encrypt: 'ry9sIc/QPZBTBcV58f72C6v7a1o0TmkiwmEObvdmm8O1sXVP16EJHeqF6qWawS1nGxootoLxF4eTHQDXnUrWi6XnSOBHs9i814BUk9HoGaBmxzfcz94dvICwDce1r4svtBdD0kqLRGQyXa5K29gzS/FKZPKgi3jmdofqzPx1zVjv3b7UjYMEhiMO7IIcPuO9SwFh9Id3gh0aG+FTuHjwzHyktKmfQrem45K2bxO4IFgA+McrSZbAzhZqjpTWoRPTR8kEyPm6laYdsVB4+OCFB4ObFFzb12DjxLm3fpmaetO5vX4dCS/Wkbg2cVhOmsbt3qX6Ub+R2MFRRHPx92Ca4jyw0tcbMjPIncO1kSOZLWmZ0G9MFrjrJUdOecVhtZiG' }

let query = {
    signature: '3efa34d4bed1e0c0b7beb7dfb8406bd773907dd3',
    timestamp: '1501115681044',
    nonce: 'Vy5LXPob'
}
let aes = new Aes('1234567890123456789012345678901234567890123', 'dinge0e69ed313daa460', '123456');
let jsonParsed = aes.decode(json.encrypt, query.timestamp, query.nonce, query.signature);
console.log(jsonParsed)


let encoded = aes.encode('success', 1500957302881, 'KOHjp9ss');
console.log(encoded);
let parsed = aes.decode(encoded.encrypt, encoded.timeStamp, encoded.nonce, encoded.msg_signature);
console.log(parsed)



// { msg_signature: '4c564e6f15be49f497e7964d1582bd1f0f47a645',
//   timeStamp: 1500957302881,
//   nonce: 'KOHjp9ss',
//   encrypt: '5nFxuCvzKOqbETmCOYa61HxtBHu5ICHhGLdEo7lEYpZlQ+XMKPkB4OjmOvSqKRAr' }