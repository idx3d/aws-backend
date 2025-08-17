import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
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

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'URL of the API Gateway',
    });
  }
}