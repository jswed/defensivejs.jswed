"use strict";

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


