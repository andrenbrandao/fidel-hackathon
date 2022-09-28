import * as cdk from 'aws-cdk-lib';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from 'constructs';

const MS_HOST = 'https://37uw70zeq5.execute-api.us-east-1.amazonaws.com/staging';

export class GatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, "apigateway");
    const hello = api.root.addResource('hello');
    hello.addMethod('GET', new apigateway.HttpIntegration(`${MS_HOST}/messages/hello`));
  }
}
