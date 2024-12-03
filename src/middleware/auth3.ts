import { Request, Response, NextFunction } from 'express';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

// Initialize the OAuth instance
const oauth = new OAuth({
    consumer: {
        key: process.env.OAUTH_CONSUMER_KEY || '',
        secret: process.env.OAUTH_CONSUMER_SECRET || '',
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
});

/**
 * Middleware to authenticate requests using OAuth 1.0a
 */
export const authenticateOAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'No Authorization header provided' });
        return;
    }

    const requestData: OAuth.RequestOptions = {
        url: `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`, // Normalize URL
        method: req.method,
        data: req.method === 'GET' ? req.query : req.body,
    };

    const authParams = parseAuthHeader(authHeader);

    if (!authParams) {
        res.status(401).json({ error: 'Invalid Authorization header' });
        return;
    }

    const token = {
        key: authParams.oauth_token || '', // Token key (if applicable)
        secret: process.env.OAUTH_TOKEN_SECRET || '', // Token secret
    };

    // Construct OAuth data object
    const oauthData: OAuth.Data = {
        oauth_consumer_key: authParams.oauth_consumer_key,
        oauth_nonce: authParams.oauth_nonce,
        oauth_signature_method: authParams.oauth_signature_method,
        oauth_timestamp: Number(authParams.oauth_timestamp), // Ensure timestamp is a number
        oauth_version: authParams.oauth_version,
    };

    try {
        // Generate the expected signature
        const baseString = oauth.getBaseString(requestData, oauthData);
        const signingKey = `${oauth.consumer.secret}&${token.secret}`; // Concatenate the secrets with '&'
        const expectedSignature = oauth.hash_function(baseString, signingKey);

        // Compare the expected signature with the received signature
        if (decodeURIComponent(authParams.oauth_signature) !== expectedSignature) {
            console.error('Signature mismatch:');
            console.error('Expected signature:', expectedSignature);
            console.error('Received signature:', decodeURIComponent(authParams.oauth_signature));
            res.status(401).json({ error: 'Invalid OAuth signature' });
            return;
        }

        next(); // Authentication passed
    } catch (error) {
        console.error('OAuth error:', error);
        res.status(500).json({ error: 'Internal server error during OAuth validation' });
    }
};

/**
 * Parse the Authorization header into a key-value object
 * @param header Authorization header string
 * @returns Parsed key-value object or null if invalid
 */
function parseAuthHeader(header: string): Record<string, string> | null {
    const match = header.match(/^OAuth\s+(.*)$/);
    if (!match) return null;

    return match[1].split(',').reduce((acc: Record<string, string>, param) => {
        const [key, value] = param.trim().split('=');
        acc[key.trim()] = value.replace(/"/g, '').trim();
        return acc;
    }, {});
}
