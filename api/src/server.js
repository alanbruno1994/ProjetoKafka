import express from "express";
import routes from "./Routes";
const app = express();

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:9092"], //kafka e o nome do broker que esta no docker-compose.yml
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "certificate-group-receiver" });
async function run() {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({ topic: "certification-response" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Resposta", String(message.value));
    },
  });

  app.listen(3333);
}

run().catch(console.error);
//Aqui disponibiliza o producer para todas as rotas
app.use((req, resp, next) => {
  req.producer = producer;
  next();
});

app.use(routes);
