import connectionManager from "./connectionManager";
import assert from "assert";
import { SystemConsumerStrategies } from "node-eventstore-client";

const baseErr = "Create PersistentSubscription - ";

const defaultSettings = {
  resolveLinkTos: true,
  startFrom: 0,
  maxRetryCount: 10,
  liveBufferSize: 500,
  readBatchSize: 20,
  historyBufferSize: 500,
  extraStatistics: false,
  messageTimeout: 10000,
  checkPointAfter: 1000,
  minCheckPointCount: 10,
  maxCheckPointCount: 500,
  maxSubscriberCount: 10,
  namedConsumerStrategy: SystemConsumerStrategies.RoundRobin
};
export default config => async (
  /**
   * @type {string}
   */
  streamName,
  /**
   * @type {string}
   */
  groupName,
  /**
   * @type {any}
   */
  settings
) => {
  const thisSettings = Object.assign(defaultSettings, settings || {});

  assert(streamName, `${baseErr}Stream Name not provided`);
  assert(groupName, `${baseErr}Group Name not provided`);
  const connection = await connectionManager.create(config);

  try {
    return await connection.createPersistentSubscription(
      streamName,
      groupName,
      thisSettings,
      config.credentials
    );
  } catch (err) {
    throw err;
  } finally {
    // todo: autoRelease option
    if (connection) {
      connection.releaseConnection();
    }
  }
};
