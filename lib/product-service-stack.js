"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServiceStack = void 0;
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const lambdaNodejs = require("aws-cdk-lib/aws-lambda-nodejs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const sqs = require("aws-cdk-lib/aws-sqs");
const sns = require("aws-cdk-lib/aws-sns");
const snsSubscriptions = require("aws-cdk-lib/aws-sns-subscriptions");
const lambdaEventSources = require("aws-cdk-lib/aws-lambda-event-sources");
class ProductServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        createProductTopic.addSubscription(new snsSubscriptions.EmailSubscription('your-email@example.com'));
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
        catalogBatchProcessFunction.addEventSource(new lambdaEventSources.SqsEventSource(catalogItemsQueue, {
            batchSize: 5,
            reportBatchItemFailures: true,
        }));
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
exports.ProductServiceStack = ProductServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1zZXJ2aWNlLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvZHVjdC1zZXJ2aWNlLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyxpREFBaUQ7QUFDakQsOERBQThEO0FBQzlELHlEQUF5RDtBQUN6RCwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLHNFQUFzRTtBQUN0RSwyRUFBMkU7QUFHM0UsTUFBYSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNoRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDJDQUEyQztRQUMzQyxNQUFNLHVCQUF1QixHQUFHLElBQUksWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUU7WUFDL0YsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxLQUFLLEVBQUUsMENBQTBDO1lBQ2pELE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFlBQVksRUFBRSxpQkFBaUI7WUFDL0IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNqQyxRQUFRLEVBQUU7Z0JBQ1IsZUFBZSxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUM1QixNQUFNLEVBQUUsSUFBSTthQUNiO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsNENBQTRDO1FBQzVDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUMvRixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1lBQ25DLEtBQUssRUFBRSwwQ0FBMEM7WUFDakQsT0FBTyxFQUFFLFNBQVM7WUFDbEIsWUFBWSxFQUFFLGlCQUFpQjtZQUMvQixPQUFPLEVBQUUs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QyxDQUFDLENBQUM7UUFFN0YsaUNBQWlDO1FBQ2pDLE1BQU0sbUJBQW1CLEdBQUcsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBRXhFLDRCQUE0QjtRQUM1QixtQkFBbUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztRQUVoRyxVQUFVO1FBQ1YsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDdkMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHO1lBQ2QsV0FBVyxFQUFFLHdCQUF3QjtTQUN0QyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFO1lBQzlDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxRQUFRO1lBQ2pDLFdBQVcsRUFBRSxvQ0FBb0M7U0FDbEQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUMvQyxLQUFLLEVBQUUsa0JBQWtCLENBQUMsUUFBUTtZQUNsQyxXQUFXLEVBQUUscUNBQXFDO1NBQ25ELENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXhIRCxrREF3SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgbGFtYmRhTm9kZWpzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuaW1wb3J0ICogYXMgc3FzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zcXMnO1xuaW1wb3J0ICogYXMgc25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zbnMnO1xuaW1wb3J0ICogYXMgc25zU3Vic2NyaXB0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zLXN1YnNjcmlwdGlvbnMnO1xuaW1wb3J0ICogYXMgbGFtYmRhRXZlbnRTb3VyY2VzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtZXZlbnQtc291cmNlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGNsYXNzIFByb2R1Y3RTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBMYW1iZGEgZnVuY3Rpb24gZm9yIGdldHRpbmcgYWxsIHByb2R1Y3RzXG4gICAgY29uc3QgZ2V0UHJvZHVjdHNMaXN0RnVuY3Rpb24gPSBuZXcgbGFtYmRhTm9kZWpzLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdHZXRQcm9kdWN0c0xpc3RGdW5jdGlvbicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YLFxuICAgICAgZW50cnk6ICdsYW1iZGEvcHJvZHVjdHMvZ2V0UHJvZHVjdHNMaXN0L2luZGV4LnRzJyxcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ2dldFByb2R1Y3RzTGlzdCcsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMCksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBleHRlcm5hbE1vZHVsZXM6IFsnYXdzLXNkayddLFxuICAgICAgICBtaW5pZnk6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gTGFtYmRhIGZ1bmN0aW9uIGZvciBnZXR0aW5nIHByb2R1Y3QgYnkgSURcbiAgICBjb25zdCBnZXRQcm9kdWN0c0J5SWRGdW5jdGlvbiA9IG5ldyBsYW1iZGFOb2RlanMuTm9kZWpzRnVuY3Rpb24odGhpcywgJ0dldFByb2R1Y3RzQnlJZEZ1bmN0aW9uJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgICBlbnRyeTogJ2xhbWJkYS9wcm9kdWN0cy9nZXRQcm9kdWN0c0J5SWQvaW5kZXgudHMnLFxuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgZnVuY3Rpb25OYW1lOiAnZ2V0UHJvZHVjdHNCeUlkJyxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGV4dGVybmFsTW9kdWxlczogWydhd3Mtc2RrJ10sXG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBTUVMgUXVldWUgZm9yIGNhdGFsb2cgaXRlbXNcbiAgICBjb25zdCBjYXRhbG9nSXRlbXNRdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ0NhdGFsb2dJdGVtc1F1ZXVlJywge1xuICAgICAgcXVldWVOYW1lOiAnY2F0YWxvZ0l0ZW1zUXVldWUnLFxuICAgICAgdmlzaWJpbGl0eVRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwMCksXG4gICAgICBkZWFkTGV0dGVyUXVldWU6IHtcbiAgICAgICAgcXVldWU6IG5ldyBzcXMuUXVldWUodGhpcywgJ0NhdGFsb2dJdGVtc0RlYWRMZXR0ZXJRdWV1ZScsIHtcbiAgICAgICAgICBxdWV1ZU5hbWU6ICdjYXRhbG9nSXRlbXNRdWV1ZS1kbHEnLFxuICAgICAgICB9KSxcbiAgICAgICAgbWF4UmVjZWl2ZUNvdW50OiAzLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFNOUyBUb3BpYyBmb3IgcHJvZHVjdCBjcmVhdGlvbiBub3RpZmljYXRpb25zXG4gICAgY29uc3QgY3JlYXRlUHJvZHVjdFRvcGljID0gbmV3IHNucy5Ub3BpYyh0aGlzLCAnQ3JlYXRlUHJvZHVjdFRvcGljJywge1xuICAgICAgdG9waWNOYW1lOiAnY3JlYXRlUHJvZHVjdFRvcGljJyxcbiAgICAgIGRpc3BsYXlOYW1lOiAnUHJvZHVjdCBDcmVhdGlvbiBUb3BpYycsXG4gICAgfSk7XG5cbiAgICAvLyBFbWFpbCBzdWJzY3JpcHRpb24gZm9yIFNOUyB0b3BpYyAocmVwbGFjZSB3aXRoIHlvdXIgZW1haWwpXG4gICAgY3JlYXRlUHJvZHVjdFRvcGljLmFkZFN1YnNjcmlwdGlvbihcbiAgICAgIG5ldyBzbnNTdWJzY3JpcHRpb25zLkVtYWlsU3Vic2NyaXB0aW9uKCd5b3VyLWVtYWlsQGV4YW1wbGUuY29tJylcbiAgICApO1xuXG4gICAgLy8gTGFtYmRhIGZ1bmN0aW9uIGZvciBiYXRjaCBwcm9jZXNzaW5nIGNhdGFsb2cgaXRlbXMgZnJvbSBTUVNcbiAgICBjb25zdCBjYXRhbG9nQmF0Y2hQcm9jZXNzRnVuY3Rpb24gPSBuZXcgbGFtYmRhTm9kZWpzLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdDYXRhbG9nQmF0Y2hQcm9jZXNzRnVuY3Rpb24nLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMThfWCxcbiAgICAgIGVudHJ5OiAnbGFtYmRhL3Byb2R1Y3RzL2NhdGFsb2dCYXRjaFByb2Nlc3MvaW5kZXgudHMnLFxuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgZnVuY3Rpb25OYW1lOiAnY2F0YWxvZ0JhdGNoUHJvY2VzcycsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygzMDApLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgU05TX1RPUElDX0FSTjogY3JlYXRlUHJvZHVjdFRvcGljLnRvcGljQXJuLFxuICAgICAgfSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGV4dGVybmFsTW9kdWxlczogWydhd3Mtc2RrJ10sXG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBDb25maWd1cmUgU1FTIGFzIGV2ZW50IHNvdXJjZSBmb3IgY2F0YWxvZ0JhdGNoUHJvY2VzcyBMYW1iZGFcbiAgICBjYXRhbG9nQmF0Y2hQcm9jZXNzRnVuY3Rpb24uYWRkRXZlbnRTb3VyY2UoXG4gICAgICBuZXcgbGFtYmRhRXZlbnRTb3VyY2VzLlNxc0V2ZW50U291cmNlKGNhdGFsb2dJdGVtc1F1ZXVlLCB7XG4gICAgICAgIGJhdGNoU2l6ZTogNSxcbiAgICAgICAgcmVwb3J0QmF0Y2hJdGVtRmFpbHVyZXM6IHRydWUsXG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBHcmFudCBwZXJtaXNzaW9uc1xuICAgIGNyZWF0ZVByb2R1Y3RUb3BpYy5ncmFudFB1Ymxpc2goY2F0YWxvZ0JhdGNoUHJvY2Vzc0Z1bmN0aW9uKTtcbiAgICBjYXRhbG9nSXRlbXNRdWV1ZS5ncmFudENvbnN1bWVNZXNzYWdlcyhjYXRhbG9nQmF0Y2hQcm9jZXNzRnVuY3Rpb24pO1xuXG4gICAgLy8gQVBJIEdhdGV3YXlcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdQcm9kdWN0U2VydmljZUFwaScsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiAnUHJvZHVjdCBTZXJ2aWNlIEFQSScsXG4gICAgICBkZXNjcmlwdGlvbjogJ0FQSSBmb3IgUHJvZHVjdCBTZXJ2aWNlJyxcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcbiAgICAgICAgYWxsb3dNZXRob2RzOiBhcGlnYXRld2F5LkNvcnMuQUxMX01FVEhPRFMsXG4gICAgICAgIGFsbG93SGVhZGVyczogWydDb250ZW50LVR5cGUnLCAnWC1BbXotRGF0ZScsICdBdXRob3JpemF0aW9uJywgJ1gtQXBpLUtleSddLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIC9wcm9kdWN0cyByZXNvdXJjZVxuICAgIGNvbnN0IHByb2R1Y3RzUmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncHJvZHVjdHMnKTtcbiAgICBcbiAgICAvLyBHRVQgL3Byb2R1Y3RzXG4gICAgcHJvZHVjdHNSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGdldFByb2R1Y3RzTGlzdEZ1bmN0aW9uKSk7XG4gICAgXG4gICAgLy8gL3Byb2R1Y3RzL3twcm9kdWN0SWR9IHJlc291cmNlXG4gICAgY29uc3QgcHJvZHVjdEJ5SWRSZXNvdXJjZSA9IHByb2R1Y3RzUmVzb3VyY2UuYWRkUmVzb3VyY2UoJ3twcm9kdWN0SWR9Jyk7XG4gICAgXG4gICAgLy8gR0VUIC9wcm9kdWN0cy97cHJvZHVjdElkfVxuICAgIHByb2R1Y3RCeUlkUmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnLCBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihnZXRQcm9kdWN0c0J5SWRGdW5jdGlvbikpO1xuXG4gICAgLy8gT3V0cHV0c1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdBcGlHYXRld2F5VXJsJywge1xuICAgICAgdmFsdWU6IGFwaS51cmwsXG4gICAgICBkZXNjcmlwdGlvbjogJ1VSTCBvZiB0aGUgQVBJIEdhdGV3YXknLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0NhdGFsb2dJdGVtc1F1ZXVlVXJsJywge1xuICAgICAgdmFsdWU6IGNhdGFsb2dJdGVtc1F1ZXVlLnF1ZXVlVXJsLFxuICAgICAgZGVzY3JpcHRpb246ICdVUkwgb2YgdGhlIFNRUyBDYXRhbG9nIEl0ZW1zIFF1ZXVlJyxcbiAgICB9KTtcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdDcmVhdGVQcm9kdWN0VG9waWNBcm4nLCB7XG4gICAgICB2YWx1ZTogY3JlYXRlUHJvZHVjdFRvcGljLnRvcGljQXJuLFxuICAgICAgZGVzY3JpcHRpb246ICdBUk4gb2YgdGhlIFNOUyBDcmVhdGUgUHJvZHVjdCBUb3BpYycsXG4gICAgfSk7XG4gIH1cbn0iXX0=