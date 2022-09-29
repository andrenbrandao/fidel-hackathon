import {
  Stack,
  StackProps,
  aws_lambda as lambda,
  aws_apigateway as apigateway,
  Duration,
} from 'aws-cdk-lib';

import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

import { Construct } from 'constructs';

const MS_HOST = 'https://ertekdvsqc.execute-api.eu-west-1.amazonaws.com/staging';

export class GatewayStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const authLambda = new NodejsFunction(this, 'my-function', {
      memorySize: 1024,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'handler',
      entry: path.join(__dirname, `/../src/functions/authorizer/index.ts`),
    });

    const authorizer = new apigateway.TokenAuthorizer(this, 'apigateway-authorizer', {
      handler: authLambda,
      identitySource:'method.request.header.AuthorizeToken'
    });

    const api = new apigateway.RestApi(this, "apigateway");

    const hello = api.root.addResource('hello');
    hello.addMethod('GET', new apigateway.HttpIntegration(`${MS_HOST}/messages/hello`), {
      authorizer: authorizer,
    });
  }
}
