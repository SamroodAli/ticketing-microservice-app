import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan; // question mark tells typescript this is going to be undefined for some time

  //cluserId that we want to connect to, the client name, url of the bus to connect
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log(`${clientId} connected to nats`);
        resolve();
      });
      this._client!.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
