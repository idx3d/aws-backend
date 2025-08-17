const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const sqs = new SQSClient({ region: 'us-east-1' });

async function sendTestMessages() {
  const queueUrl = 'https://sqs.us-east-1.amazonaws.com/223863690854/catalogItemsQueue';
  
  const testProducts = [
    {
      title: 'Test Game 1',
      description: 'A fantastic RPG adventure',
      price: 29.99,
      count: 10
    },
    {
      title: 'Test Game 2', 
      description: 'Action-packed shooter',
      price: 39.99,
      count: 5
    },
    {
      title: 'Test Game 3',
      description: 'Puzzle platformer',
      price: 19.99,
      count: 15
    }
  ];

  for (const product of testProducts) {
    try {
      const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({ csvData: product }),
      });
      
      const result = await sqs.send(command);
      console.log(`Message sent for ${product.title}:`, result.MessageId);
    } catch (error) {
      console.error(`Error sending message for ${product.title}:`, error);
    }
  }
}

sendTestMessages();