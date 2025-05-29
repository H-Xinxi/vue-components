import crypto from 'crypto-browserify'

export class AccessToken {
    static encodeText(text) {
        let encodedText = encodeURIComponent(text);
        return encodedText.replace('+', '%20').replace('*', '%2A').replace('~', '%7E');
    }

    static encodeDict(dict) {
        let keys = Object.keys(dict).sort();
        return keys.map(key => `${this.encodeText(key)}=${this.encodeText(dict[key])}`).join('&');
    }

    static async createToken(accessKeyId, accessKeySecret) {
        const parameters = {
            AccessKeyId: accessKeyId,
            Action: 'CreateToken',
            Format: 'JSON',
            RegionId: 'cn-shanghai',
            SignatureMethod: 'HMAC-SHA1',
            SignatureNonce: uuidv4(),
            SignatureVersion: '1.0',
            Timestamp: new Date().toISOString(),
            Version: '2019-02-28'
        };

        const queryString = this.encodeDict(parameters);
        console.log('Normalized request string:', queryString);

        const stringToSign = `GET&${this.encodeText('/')}&${this.encodeText(queryString)}`;
        console.log('String to sign:', stringToSign);

        const hmac = crypto.createHmac('sha1', `${accessKeySecret}&`);
        hmac.update(stringToSign);
        const signature = hmac.digest('base64');
        console.log('Signature:', signature);

        const encodedSignature = this.encodeText(signature);
        console.log('URL-encoded signature:', encodedSignature);

        const fullUrl = `http://nls-meta.cn-shanghai.aliyuncs.com/?Signature=${encodedSignature}&${queryString}`;
        console.log('URL:', fullUrl);

        // Using fetch for HTTP request
        const response = await fetch(fullUrl);
        if (response.ok) {
            const jsonResponse = await response.json();
            if (jsonResponse.Token) {
                return {
                    token: jsonResponse.Token.Id,
                    expireTime: jsonResponse.Token.ExpireTime
                };
            }
        }
        console.error(await response.text());
        return {
            token: null,
            expireTime: null
        };
    }
}

// Sample UUIDv4 function, or you could use a library like `uuid`
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}