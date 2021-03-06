import AWS from 'aws-sdk';
import fs from 'fs';

const {
    AWS_LAMBDA_FUNCTION_NAME,
    AWS_REGION,
    SECRET_NAME,
} = process.env;

const secretsManager = new AWS.SecretsManager({
    region: AWS_REGION,
});

async function getSecret(secretName) {
    const secretValue = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

    if (secretValue?.SecretString) {
        return JSON.parse(secretValue.SecretString);
    } else {
        const buffer = Buffer.from(secretValue.SecretBinary, 'base64');
        return buffer.toString('ascii');
    }
}

async function main() {
    if (process.argv.length !== 3) {
        throw new Error('Cannot determine temp file');
    }

    const tmpFile = process.argv[2];
    const secretName = SECRET_NAME ?? `lambda/${AWS_LAMBDA_FUNCTION_NAME}`;
    const secret = await getSecret(secretName);
    const fsStream = fs.createWriteStream(tmpFile);

    for (const [key, value] of Object.entries(secret)) {
        fsStream.write(`export ${key}="${value}"\n`);
    }

    fsStream.end();
}

process.on('unhandledRejection', (e) => {
    console.error(e);
    process.exit(1);
});

main();