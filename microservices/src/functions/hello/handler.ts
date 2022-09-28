import 'source-map-support/register';

import type { APIGatewayProxyHandlerV2} from 'aws-lambda'
import { formatJSONResponse } from '@/libs/apiGateway';
import { middyfy } from '@/libs/lambda';


const hello: APIGatewayProxyHandlerV2 = async (
  event,
) => {
  console.log(event)
  return formatJSONResponse({
    message: `Hello there, welcome to the exciting Serverless world!`,
  });
};

export const main = middyfy(hello);
