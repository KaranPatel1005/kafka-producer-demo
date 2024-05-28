import { Kafka, Partitioners } from 'kafkajs';
import { kafkaConfig, kafkaGroupId } from './config';
import { Topics } from './types';

const kafka = new Kafka(kafkaConfig);

const admin = kafka.admin();
const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

async function sendMessage(topic: string, message: string, partition: number = 0): Promise<void> {
  try {
    await producer.send({
      topic,
      messages: [{ value: message, partition }],
    });

    console.log(`Message sent to topic ${topic}: ${message} ${partition}`);
  } catch (error) {
    console.error('Error sending Kafka message:', error);
  }
}

const consumer = kafka.consumer({ groupId: kafkaGroupId });

export async function ensureTopicsExist(topicsObject: Topics): Promise<void> {
  await admin.connect();
  console.log('Admin connected');

  try {
    const existingTopics = await admin.listTopics();
    const topicsToCreate = Object.values(topicsObject)
      .filter((topicName) => !existingTopics.includes(topicName))
      .map((topicName) => ({ topic: topicName }));

    if (topicsToCreate.length > 0) {
      await admin.createTopics({
        topics: topicsToCreate,
        waitForLeaders: true,
      });
      console.log('Topics created:', topicsToCreate.map((t) => t.topic).join(', '));
    } else {
      console.log('All topics already exist.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await admin.disconnect();
    console.log('Admin Disconnected');
  }
}

export { kafka, producer, consumer, sendMessage };
