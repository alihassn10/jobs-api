require('dotenv').config();
require('express-async-errors');
const helmet = require('helmet');
const cors=require('cors')
const xss=require('xss-clean')
const rateLimiter=require('express-rate-limit')

//swagger
const swaggerUI=require('swagger-ui-express')
const YAML=require('yamljs')
const swaggerDocument=YAML.load('./swagger.yaml')

//db connection
const connectDB = require('./db/connect');

//routes

const authRoute=require('./routes/auth')
const jobsRoute=require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const auth = require('./middleware/authentication');

const express = require('express');
const app = express();

app.use(express.json());
  
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('<h1>Jobs APIS</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/jobs',auth,jobsRoute)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//security
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet())
app.use(cors({ origin: '*' }));
app.use(xss)

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    await connectDB(process.env.MONGO_URI)
  } catch (error) {
    console.log(error);
  }
};

start();
