import connectionManager from "./connectionManager";
import mapEvents from "./utilities/mapEvents";
import client from "node-eventstore-client";
import debugModule from "debug";
import assert from "assert";

const debug = debugModule("geteventstore:connectToPersistentSubscription");
const baseErr = "Subscribe to PersistentStream - ";

export default config => (
  streamName,
  groupName,
  onEventAppeared,
  onDropped,
  bufferSize,
  autoAck = true
) =>
  new Promise(async (resolve, reject) => {
    assert(streamName, `${baseErr}Stream Name not provided`);

    let connection;
    const onEvent = (sub, ev) => {
      const mappedEvent = mapEvents([ev])[0];
      if (mappedEvent) onEventAppeared(sub, mappedEvent);
    };

    const onDroppedHandler = (subscription, reason, error) =>
      onDropped(connection, subscription, reason, error);

    const onConnected = async () => {
      try {
        const subscription = await connection.connectToPersistentSubscription(
          streamName,
          groupName,
          onEventAppeared,
          onDroppedHandler,
          new client.UserCredentials(
            config.credentials.username,
            config.credentials.password
          ),
          bufferSize,
          autoAck
        );
        debug("", "Subscription: %j", subscription);
        resolve(subscription);
      } catch (ex) {
        reject(ex);
      }
    };

    try {
      connection = await connectionManager.create(config, onConnected, true);
    } catch (ex) {
      reject(ex);
    }
  });
