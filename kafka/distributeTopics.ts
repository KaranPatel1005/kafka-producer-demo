import { EachMessagePayload } from "kafkajs";
import { TOPICS } from "./kafka";

interface DistributeTopics extends EachMessagePayload {}

export const distributeTopics = ({ topic, message }: DistributeTopics) => {
  console.log(
    "🚀 ~ distributeTopics ~ topic, message:",
    topic,
    "MESSAGE",
    message.value?.toString()
  );
  switch (topic) {
    case TOPICS.topic1: {
      if (message.value?.toString()) {
        console.log("🚀 ~ distributeTopics ~ message topic 1:", topic, message);
      }
      break;
    }

    default:
      break;
  }
};
