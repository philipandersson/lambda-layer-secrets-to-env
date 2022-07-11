# lambda-layer-secrets-to-env
AWS Lambda Extension layer that securely fetches secrets from AWS Secrets Manager and injects them as environment variables into your Lambda's execution environment.
It uses as an extension wrapper script to invoke the fetching of secrets during the `Init` phase of the Lambda.

## Create Lambda layer
```
zip -r layer.zip .
```



## Wrapper script enviornment variable
| Environment variable | Value |
| --- | --- |
| AWS_LAMBDA_EXEC_WRAPPER | `/opt/secrets-to-env-wrapper` |
