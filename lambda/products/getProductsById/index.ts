import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const products = [
  {
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    title: "The Legend of Zelda: Breath of the Wild",
    description: "Open-world adventure game with exploration and puzzle-solving",
    price: 59,
    count: 15
  },
  {
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    title: "Cyberpunk 2077",
    description: "Futuristic RPG set in Night City with immersive storyline",
    price: 39,
    count: 8
  },
  {
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
    title: "Super Mario Odyssey",
    description: "3D platformer featuring Mario's cap-throwing adventures",
    price: 49,
    count: 12
  },
  {
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    title: "God of War",
    description: "Action-adventure game following Kratos and Atreus in Norse mythology",
    price: 29,
    count: 6
  },
  {
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    title: "Minecraft",
    description: "Sandbox game allowing unlimited creativity and exploration",
    price: 26,
    count: 25
  },
  {
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a4",
    title: "Elden Ring",
    description: "Dark fantasy action RPG with challenging combat and open world",
    price: 59,
    count: 4
  },
  {
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a5",
    title: "The Witcher 3: Wild Hunt",
    description: "Fantasy RPG with rich storytelling and monster hunting",
    price: 19,
    count: 10
  },
  {
    id: "7567ec4b-b10c-48c5-9345-fc73c48a80a6",
    title: "Animal Crossing: New Horizons",
    description: "Life simulation game where you build and customize your island",
    price: 54,
    count: 18
  }
];

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2));

    const productId = event.pathParameters?.productId;

    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: JSON.stringify({
          message: 'Product ID is required',
        }),
      };
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        },
        body: JSON.stringify({
          message: 'Product not found',
        }),
      };
    }

    const response: APIGatewayProxyResult = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify(product),
    };

    return response;
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    };
  }
};