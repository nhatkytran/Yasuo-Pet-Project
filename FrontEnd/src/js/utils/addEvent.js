/**
 * @param {HTMLElement[]} nodes
 * @param {String} eventName click,...
 * @param {Function} callback
 */
const addEvent = (nodes, eventName, callback) =>
  nodes.forEach(node =>
    node.addEventListener(eventName, event => callback(event, node))
  );

export default addEvent;
