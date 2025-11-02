import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'Portfolio API',
      version: '1.0.0',
      description:
        'This is the official API documentation for the portfolio project.',
      contact: {
        name: 'Ritesh', // Your Name
        email: 'your-email@example.com', // Your Email
      },
    },
    servers: [
      {
        url: 'http://localhost:5002', // <-- MAKE SURE THIS IS PORT 5002
        description: 'Development server',
      },
    ],
    // This block tells Swagger how to handle the "Authorize" button
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs
  apis: ['./src/routes/*.ts'], // This finds all your route files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;