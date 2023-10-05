import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';
import { schema } from './graphql/schema';

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect('YOUR_MONGODB_URI');

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true // This allows you to use the GraphiQL tool at /graphql endpoint
}));

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}/graphql`);
});
