// @ts-ignore
export const handler = async (event)=> {
  let token = event.authorizationToken;

  let effect = 'Deny';

  if (token == "abc") {
    effect = 'Allow';
  } 

  let policy = {
    "principalId": "user",
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [{
          "Action": "execute-api:Invoke",
          "Effect": effect,
          "Resource": event.methodArn
      }]
    }
  };

  return policy;
};