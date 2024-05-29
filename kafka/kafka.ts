import { producer, consumer, ensureTopicsExist } from "./setup";
import dotenv from "dotenv";
import { KafkaError, Topics } from "./types";
import { distributeTopics } from "./distributeTopics";
import { ConsumerGroupJoinEvent } from "kafkajs";

dotenv.config();

export const TOPICS = {
  topic1: "SIGNUP",
};

async function runProducer() {
  await producer.connect();
  console.log("Producer connected");
  // Add producer logic here
}

async function runConsumer(TOPICS: Topics) {
  const topics: string[] = Object.values(TOPICS);
  console.log("🚀 ~ runConsumer ~ topics:", topics);

  await consumer.connect();
  console.log("Consumer connected");
  await consumer.subscribe({ topics, fromBeginning: true });

  consumer.on("consumer.group_join", async (args: ConsumerGroupJoinEvent) => {
    console.log("🚀 ~ consumer.on ~ args:", args);
  });

  consumer.on("consumer.rebalancing", (event) => {
    console.log("Heartbeat sent", event);
  });

  await consumer.run({
    eachMessage: async (kafkaMessage) => {
      distributeTopics(kafkaMessage);
    },
  });

  const handleConsumerCrash = async (err: unknown) => {
    const error = err as Error;
    console.error("Consumer crashed", error);

    // Optional: Alert system administrators
    // This can be an email, SMS, or integration with an alerting tool like PagerDuty
    // sendAlert(`Kafka Consumer crashed: ${error.message}`);

    // Attempt to reconnect the consumer
    try {
      console.log("Attempting to reconnect consumer...");
      await consumer.disconnect();
      await consumer.connect();
      await consumer.subscribe({ topics, fromBeginning: true });

      // Re-run the consumer logic
      await consumer.run({
        eachMessage: async (kafkaMessage) => {
          distributeTopics(kafkaMessage);
        },
      });
      console.log("Consumer reconnected and listening");
    } catch (reconnectError) {
      console.error("Failed to reconnect consumer:", reconnectError);
      // Handle failed reconnection attempt (e.g., retry, exit process)
      // This might include a back-off strategy for reconnection attempts
    }
  };

  consumer.on("consumer.crash", async (event) => {
    console.error("Consumer crashed", event);
    await handleConsumerCrash(event.payload.error);
  });

  console.log("Consumer subscribed and listening");
}

async function runKafka(retryCount: number = 0, maxRetries: number = 5) {
  try {
    await ensureTopicsExist(TOPICS);
    await runProducer();
    await runConsumer(TOPICS);
  } catch (err) {
    const error = err as KafkaError;
    console.error("Error in Kafka setup:", error);
    if (error.retriable && retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      // Set your max retry count
      console.log(`Retrying... in ${delay}ms... Attempt: ${retryCount + 1}`);
      setTimeout(() => runKafka(retryCount + 1, maxRetries), delay); // Retry after 5 seconds
    } else {
      console.error("Max retry attempts reached, exiting.");
      process.exit(1); // Exit process after max retries
    }
  }
}

runKafka().catch(console.error);

async function gracefulShutdown() {
  console.log("Shutting down gracefully");
  await producer.disconnect();
  await consumer.disconnect();
  process.exit(0);
}

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
