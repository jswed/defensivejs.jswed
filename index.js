"use strict";

var FowardHandler = require('./lib/forwarding-handler');

/**
 * change specified properties' descriptor on this object.
 * @param {String} props comma separated property list
 * @param {Object} descriptor
 */
Object.prototype.describe = function(props, descriptor) {
  var me = this;
  descriptor = (typeof descriptor) === 'object' ? descriptor : {};
  props.split(',').forEach(function(prop) {
    if(me.hasOwnProperty(prop)){
      Object.defineProperty(me, prop, descriptor);
    }
  });
};

/**
 * create a new object, making the specified properties read-only.
  * @param {String} props comma separated property list
 */
Object.prototype.readonly = function(props) {
  var me = this;
  props = props.split(',').reduce(function(obj, key) {
    obj[key] = 1;
    return obj;
  },{});

  function guardian(proxy, prop) {
    if (prop in props) {
      throw new ReferenceError("property \"" + prop + "\" is currently under protection");
    }
    return me[prop];
  }

  var handler = new FowardHandler(me);
  handler.set = handler.get = guardian;
  return Proxy.create(handler);
};

var obj = {
  id: 123,
  name: 'John',
  role: 'developer',
  // some meta properties
  maxage: 3600,
  updated: +new Date(),
  uid: 'bb728382-8811-4434-ae53-261c14abdabb'
};

console.log(Object.keys(obj));

obj.describe('maxage,updated,uid', { enumerable: false });

console.log(Object.keys(obj));

Object.preventExtensions(obj);
//obj.email = 'foo@bar.com';  // can't augment

Object.seal(obj);
//delete obj.name;  // can't remove


Object.freeze(obj);
//obj.name = 'Garry'; // can't mutate

var proxied = obj.readonly('maxage,updated,uid');

Object.keys(proxied);
console.log(proxied.uid); // can't read



