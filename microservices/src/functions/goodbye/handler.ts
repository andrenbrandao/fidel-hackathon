import 'source-map-support/register';

import type { APIGatewayProxyHandlerV2} from 'aws-lambda'
import { formatJSONResponse } from '@/libs/apiGateway';
import { middyfy } from '@/libs/lambda';


const goodbye: APIGatewayProxyHandlerV2 = async (
  event,
) => {
  console.log(event)
  return formatJSONResponse({
    message: `Goodbye!`,
  });
};

export const main = middyfy(goodbye);
