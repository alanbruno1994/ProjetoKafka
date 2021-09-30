//Aqui ira receber mensagens do Kafka
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "api",
  brokers: ["localhost:9092"], //kafka e o nome do broker que esta no docker-compose.yml
});

const topic = "issue-certificate";

const consumer = kafka.consumer({ groupId: "test-group" });

const producer = kafka.producer();

async function run() {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      });
      const payload = JSON.parse(message.value);
      producer.send({
        topic: "certification-response",
        messages: [
          {
            value: `Certificado do usuário ${payload.user.name} do curso ${payload.course} gerado!`,
          },
        ],
      });
    },
  });
}

run().catch(console.error);
