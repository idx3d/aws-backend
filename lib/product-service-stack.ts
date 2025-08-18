import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import { Construct } from 'constructs';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function for getting all products
    const getProductsListFunction = new lambdaNodejs.NodejsFunction(this, 'GetProductsListFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lambda/products/getProductsList/index.ts',
      handler: 'handler',
      functionName: 'getProductsList',
      timeout: cdk.Duration.seconds(30),
      bundling: {
        externalModules: ['aws-sdk'],
        minify: true,
      },
    });

    // Lambda function for getting product by ID
    const getProductsByIdFunction = new lambdaNodejs.NodejsFunction(this, 'GetProductsByIdFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lambda/products/getProductsById/index.ts',
      handler: 'handler',
      functionName: 'getProductsById',
      timeout: cdk.Duration.seconds(30),
      bundling: {
        externalModules: ['aws-sdk'],
        minify: true,
      },
    });

    // SQS Queue for catalog items
    const catalogItemsQueue = new sqs.Queue(this, 'CatalogItemsQueue', {
      queueName: 'catalogItemsQueue',
      visibilityTimeout: cdk.Duration.seconds(300),
      deadLetterQueue: {
        queue: new sqs.Queue(this, 'CatalogItemsDeadLetterQueue', {
          queueName: 'catalogItemsQueue-dlq',
        }),
        maxReceiveCount: 3,
      },
    });

    // SNS Topic for product creation notifications
    const createProductTopic = new sns.Topic(this, 'CreateProductTopic', {
      topicName: 'createProductTopic',
      displayName: 'Product Creation Topic',
    });

    // Email subscription for SNS topic (replace with your email)
    createProductTopic.addSubscription(
      new snsSubscriptions.EmailSubscription('id0x3d+test@gmail.com')
    );

    // Lambda function for batch processing catalog items from SQS
    const catalogBatchProcessFunction = new lambdaNodejs.NodejsFunction(this, 'CatalogBatchProcessFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lambda/products/catalogBatchProcess/index.ts',
      handler: 'handler',
      functionName: 'catalogBatchProcess',
      timeout: cdk.Duration.seconds(300),
      environment: {
        SNS_TOPIC_ARN: createProductTopic.topicArn,
      },
      bundling: {
        externalModules: ['aws-sdk'],
        minify: true,
      },
    });

    // Configure SQS as event source for catalogBatchProcess Lambda
    catalogBatchProcessFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(catalogItemsQueue, {
        batchSize: 5,
        reportBatchItemFailures: true,
      })
    );

    // Grant permissions
    createProductTopic.grantPublish(catalogBatchProcessFunction);
    catalogItemsQueue.grantConsumeMessages(catalogBatchProcessFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'ProductServiceApi', {
      restApiName: 'Product Service API',
      description: 'API for Product Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // /products resource
    const productsResource = api.root.addResource('products');
    
    // GET /products
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsListFunction));
    
    // /products/{productId} resource
    const productByIdResource = productsResource.addResource('{productId}');
    
    // GET /products/{productId}
    productByIdResource.addMethod('GET', new apigateway.LambdaIntegration(getProductsByIdFunction));

    // Outputs
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'URL of the API Gateway',
    });

    new cdk.CfnOutput(this, 'CatalogItemsQueueUrl', {
      value: catalogItemsQueue.queueUrl,
      description: 'URL of the SQS Catalog Items Queue',
    });

    new cdk.CfnOutput(this, 'CreateProductTopicArn', {
      value: createProductTopic.topicArn,
      description: 'ARN of the SNS Create Product Topic',
    });
  }
}