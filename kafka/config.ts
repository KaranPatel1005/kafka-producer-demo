// config.ts
import dotenv from "dotenv";
dotenv.config();

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not set.`);
  }
  return value;
}

export const kafkaConfig = {
  clientId: "kafka-gateway",
  brokers: [
    "ec2-54-196-156-132.compute-1.amazonaws.com:9092",
    "ec2-54-196-156-132.compute-1.amazonaws.com:9093",
    "ec2-54-196-156-132.compute-1.amazonaws.com:9094",
  ],
};

export const kafkaGroupId = "kafka_hub_group_demo";
