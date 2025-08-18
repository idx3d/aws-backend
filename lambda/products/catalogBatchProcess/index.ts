import { SQSEvent, SQSRecord } from 'aws-lambda';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

interface ProductData {
  title: string;
  description: string;
  price: number;
  count: number;
}

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log('Received SQS event:', JSON.stringify(event, null, 2));

  try {
    const processedProducts: ProductData[] = [];
    
    // Process each SQS message
    for (const record of event.Records) {
      const product = await processRecord(record);
      if (product) {
        processedProducts.push(product);
      }
    }

    console.log(`Successfully processed ${processedProducts.length} products`);

    // Send SNS notification if products were created
    if (processedProducts.length > 0) {
      await sendProductCreatedNotification(processedProducts);
    }

  } catch (error) {
    console.error('Error processing SQS messages:', error);
    throw error;
  }
};

async function processRecord(record: SQSRecord): Promise<ProductData | null> {
  try {
    console.log('Processing record:', record.messageId);
    
    // Parse the CSV data from SQS message
    const messageBody = JSON.parse(record.body);
    const csvData = messageBody.csvData || messageBody;
    
    // Validate required fields
    if (!csvData.title || !csvData.price) {
      console.error('Invalid product data - missing required fields:', csvData);
      return null;
    }

    const product: ProductData = {
      title: csvData.title,
      description: csvData.description || 'No description available',
      price: parseFloat(csvData.price) || 0,
      count: parseInt(csvData.count) || 0
    };

    // In a real application, you would save this to a database
    console.log('Created product:', product);
    
    return product;
  } catch (error) {
    console.error('Error processing record:', record.messageId, error);
    return null;
  }
}

async function sendProductCreatedNotification(products: ProductData[]): Promise<void> {
  try {
    const message = {
      event: 'ProductsCreated',
      timestamp: new Date().toISOString(),
      productsCount: products.length,
      products: products.map(p => ({
        title: p.title,
        price: p.price
      }))
    };

    const command = new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: JSON.stringify(message, null, 2),
      Subject: `New Products Created - ${products.length} items`
    });

    const result = await snsClient.send(command);
    console.log('SNS notification sent successfully:', result.MessageId);
  } catch (error) {
    console.error('Error sending SNS notification:', error);
    // Don't throw error here to avoid reprocessing SQS messages
  }
}