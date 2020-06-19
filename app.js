const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const graphqlHTTP = require("express-graphql");

const schema = require("./schema/schema");

const app = express();
app.use(cors());

// Connect to mongoDB
const MongoURL =
  "mongodb+srv://Sadman:789123789456@mydb-zcwke.mongodb.net/graphql?retryWrites=true";

mongoose
  .connect(MongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Connect to GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
const PORT = process.env.PORT || 5000;
app.listen(PORT);
