import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'local';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'local';

const isLocal = process.env.NODE_ENV === 'development' || DYNAMODB_ENDPOINT.includes('localhost');

const clientConfig: ConstructorParameters<typeof DynamoDBClient>[0] = {
  region: AWS_REGION,
  ...(isLocal && {
    endpoint: DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  }),
};

const dynamoDBClient = new DynamoDBClient(clientConfig);

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

export { documentClient, dynamoDBClient };

export const dynamoDbConfig = {
  client: dynamoDBClient,
  documentClient,
  tableName: process.env.DYNAMODB_TABLE_NAME || 'orders',
  region: AWS_REGION,
  isLocal,
  endpoint: DYNAMODB_ENDPOINT,
};

export interface DynamoDbConfig {
  client: DynamoDBClient;
  documentClient: DynamoDBDocumentClient;
  tableName: string;
  region: string;
  isLocal: boolean;
  endpoint: string;
}

export const DynamoDbConfig: DynamoDbConfig = {
  client: dynamoDBClient,
  documentClient,
  tableName: process.env.DYNAMODB_TABLE_NAME || 'orders',
  region: AWS_REGION,
  isLocal,
  endpoint: DYNAMODB_ENDPOINT,
};