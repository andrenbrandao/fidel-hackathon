/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import { hello, goodbye } from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'hackathon-apigateway',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      packager: 'npm',
    },
    stage: '${opt:stage, self:provider.stage}',
    stages: ['staging', 'production'],
    prune: {
      automatic: true,
      number: 3,
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-stage-manager',
    'serverless-prune-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    // endpointType: 'PRIVATE',
    // vpcEndpointIds: [
    //   {Ref: 'Vpc'}
    // ],
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['codedeploy:*'],
        Resource: '*',
      },
    ],
    vpc: {
      securityGroupIds: [{ Ref: 'LambdaSecurityGroup' }],
      subnetIds: [{ Ref: 'PrivateSubnet1' }],
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      metrics: false, // activate to see CacheHits and Misses
    },
    logs: {
      // activate to see API Gateway logs
      restApi: {
        accessLogging: false,
        executionLogging: false,
        level: 'INFO',
        fullExecutionData: false,
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { hello, goodbye },
  resources: {
    Resources: {
      Vpc: {
        Type: 'AWS::EC2::VPC',
        Properties: {
          CidrBlock: '10.0.0.0/16',
        },
      },
      PrivateSubnet1: {
        Type: 'AWS::EC2::Subnet',
        Properties: {
          AvailabilityZone: 'eu-west-1a',
          CidrBlock: '10.0.1.0/24',
          VpcId: {
            Ref: 'Vpc',
          },
        },
      },
      PublicSubnet1: {
        Type: 'AWS::EC2::Subnet',
        Properties: {
          AvailabilityZone: 'eu-west-1c',
          CidrBlock: '10.0.21.0/24',
          VpcId: {
            Ref: 'Vpc',
          },
        },
      },
      LambdaSecurityGroup: {
        Type: 'AWS::EC2::SecurityGroup',
        Properties: {
          GroupName: '${self:service}-${self:custom.stage}-lambda',
          GroupDescription: 'Allow all outbound traffic, no inbound',
          SecurityGroupIngress: [
            {
              IpProtocol: -1,
              CidrIp: '127.0.0.1/32',
            },
          ],
          VpcId: {
            Ref: 'Vpc',
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
