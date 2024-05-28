export interface KafkaError extends Error {
  retriable?: boolean;
}
export interface Topics {
  [key: string]: string;
}
