# lambda-layer-secrets-to-env
AWS Lambda layer that securely fetches secrets from AWS Secrets Manager and injects them as environment variables into your Lambda's execution environment.
It uses as an extension wrapper script to invoke the fetching of secrets during the `Init` phase of the Lambda lifecycle.
If you use containerized Lambdas you should instead of using a zipped Layer, include the code into your `Dockerfile`.

## Create Lambda layer
Creates a zip archive containing the Lambda layer and publishes it.
```
npm install
chmod +x secrets-to-env-wrapper
zip -r layer.zip .
aws lambda publish-layer-version \
 --layer-name "secrets-to-env-wrapper" \
 --zip-file  "fileb://layer.zip" \
 --compatible-runtimes nodejs
```

## Use the Lambda layer
**Note:** This overwrites the environment variables to set `AWS_LAMBDA_EXEC_WRAPPER` which points to the wrapper script (`/opt/secrets-to-env-wrapper`).
Replace `${LAMBDA_FN_NAME}` with your Lambda function name.

```
aws lambda update-function-configuration \
 --function-name ${LAMBDA_FN_NAME} \
 --environment Variables={AWS_LAMBDA_EXEC_WRAPPER=/opt/secrets-to-env-wrapper}
 --layers $(aws lambda list-layer-versions --layer-name secrets-to-env-wrapper \
 --max-items 1 --no-paginate --query 'LayerVersions[0].LayerVersionArn' \
 --output text)
```