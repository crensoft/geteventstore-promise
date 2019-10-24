import connectionManager from "./connectionManager";
import assert from "assert";

const baseErr = "Create PersistentSubscription - ";

const defaultSettings = {
  resolveLinkTos: true
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
  settings = defaultSettings
) => {
  assert(streamName, `${baseErr}Stream Name not provided`);
  assert(groupName, `${baseErr}Group Name not provided`);
  const connection = await connectionManager.create(config);

  try {
    return await connection.createPersistentSubscription(
      streamName,
      groupName,
      settings,
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
