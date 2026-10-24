import swaggerAutogen from 'swagger-autogen';

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'API Review Kantin',
    description:
      'Dokumentasi API Tugas 3 Praktikum RSI: validasi zod, autentikasi JWT, dan otorisasi berbasis role (admin, owner, customer).',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Tempel token dari POST /api/v1/auth/login (tanpa kata "Bearer").',
      },
    },
    schemas: {
      StallInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 100, example: 'Warung Bu Sari' },
          category: { type: 'string', maxLength: 50, example: 'Nasi' },
          location: { type: 'string', maxLength: 100, example: 'Kantin FKIP' },
          description: { type: 'string', maxLength: 1000, example: 'Nasi pecel dan lauk' },
        },
      },
    },
  },
};

const outputFile = './src/docs/swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);