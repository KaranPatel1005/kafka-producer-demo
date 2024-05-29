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
    "ec2-23-20-200-55.compute-1.amazonaws.com:9092",
    "ec2-23-20-200-55.compute-1.amazonaws.com:9093",
  ],
};

export const kafkaGroupId = "kafka_hub_group";
