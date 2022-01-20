const { Kafka } = require("kafkajs")

class Producers{
  constructor(){
    const kafka = new Kafka({
      brokers: ['localhost:9092', 'kafka:29092']
    })
    this.producer = kafka.producer()
    
  }

  async produce(topic, values){
    await this.producer.connect();
    await this.producer.send({
      topic: topic,
      messages: [
        {
          value: JSON.stringify(values)
        },
      ],
    });
    this.producer.disconnect();
  }
}

module.exports = Producers;