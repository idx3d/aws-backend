# AWS Training - Product Service

This project implements a Product Service using AWS CDK with Lambda functions and API Gateway.


## Test Endpoints
All Products - https://kkg32e0ajc.execute-api.us-east-1.amazonaws.com/prod/products/ 
Specific procut - https://kkg32e0ajc.execute-api.us-east-1.amazonaws.com/prod/products/7567ec4b-b10c-48c5-9345-fc73c48a80aa
Invalid Product - https://kkg32e0ajc.execute-api.us-east-1.amazonaws.com/prod/products/aaaaa


## Features

- `getProductsList` Lambda function - Returns all products (GET /products)
- `getProductsById` Lambda function - Returns a specific product (GET /products/{productId})
- API Gateway integration with CORS support
- TypeScript implementation
- Mock product data


## Prerequisites

- AWS CLI configured
- Node.js 18+
- AWS CDK bootstrapped

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Deploy

```bash
npm run deploy
```

## API Endpoints

After deployment, you'll get an API Gateway URL. The endpoints are:

- `GET /products` - Returns all products
- `GET /products/{productId}` - Returns a specific product

## Example Product IDs

You can test with these product IDs:
- 7567ec4b-b10c-48c5-9345-fc73c48a80aa
- 7567ec4b-b10c-48c5-9345-fc73c48a80a0
- 7567ec4b-b10c-48c5-9345-fc73c48a80a2

## Cleanup

```bash
npm run destroy
```


