import { Request, Response, NextFunction } from 'express';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

const oauth = new OAuth({
    consumer: {
        key: process.env.OAUTH_CONSUMER_KEY || '',
        secret: process.env.OAUTH_CONSUMER_SECRET || ''
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64');
    },
});

export const authenticateOAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'No Authorization header provided' });
        return;
    }

    const requestData: OAuth.RequestOptions = {
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        method: req.method,
        data: req.method === 'GET' ? req.query : req.body,
    };

    const authParams = parseAuthHeader(authHeader);

    if (!authParams) {
        res.status(401).json({ error: 'Invalid Authorization header' });
        return;
    }

    const oauth_data: OAuth.Data = {
        oauth_consumer_key: authParams.oauth_consumer_key,
        oauth_nonce: authParams.oauth_nonce,
        oauth_signature_method: authParams.oauth_signature_method,
        oauth_timestamp: parseInt(authParams.oauth_timestamp, 10),
        oauth_version: authParams.oauth_version,
    };

    const signatureBase = oauth.getBaseString(requestData, oauth_data);
    const expectedSignature = oauth.getSignature(requestData, oauth.consumer.secret, oauth_data);

    if (decodeURIComponent(authParams.oauth_signature) !== expectedSignature) {
        console.log('Expected signature:', expectedSignature);
        console.log('Received signature:', decodeURIComponent(authParams.oauth_signature));
        res.status(401).json({ error: 'Invalid OAuth signature' });
        return;
    }

    next();
};

function parseAuthHeader(header: string): Record<string, string> | null {
    const match = header.match(/^OAuth\s+(.*)$/);
    if (!match) return null;

    return match[1].split(',').reduce((acc: Record<string, string>, param) => {
        const [key, value] = param.trim().split('=');
        acc[key.trim()] = value.replace(/"/g, '').trim();
        return acc;
    }, {});
}

