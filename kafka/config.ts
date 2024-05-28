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
  brokers: ["ec2-18-212-21-248.compute-1.amazonaws.com:9092"],
};

export const kafkaGroupId = "kafka_hub_group";
