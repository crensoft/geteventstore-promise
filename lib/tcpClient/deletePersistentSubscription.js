import connectionManager from "./connectionManager";
import assert from "assert";

const baseErr = "Delete PersistentSubscription - ";

export default (config /**
@returns {Promise.<any>}
*/) => async (
  /**
   * @type {string}
   */
  streamName,
  /**
   * @type {string}
   */
  groupName
  /**
   * @type {any}
   */
) => {
  assert(streamName, `${baseErr}Stream Name not provided`);
  assert(groupName, `${baseErr}Group Name not provided`);

  const connection = await connectionManager.create(config);

  try {
    return await connection.deletePersistentSubscription(
      streamName,
      groupName,
      config.credentials
    );
  } catch (err) {
    throw err;
  } finally {
    if (connection) {
      connection.releaseConnection();
    }
  }
};
