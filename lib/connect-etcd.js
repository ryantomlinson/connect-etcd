/*!
 * Connect - etcd
 * Copyright(c) 2014 Opentable <rtomlinson@opentable.com>
 * MIT Licensed
 */

 var Etcd = require('node-etcd');

 var defaultHost = '127.0.0.1';
 var defaultPort = '4001';
 var oneDay = 86400;

 module.exports = function(session) {
 	var Store = session.Store;

 	function EtcdStore(options) {
 		var self = this;

 		options = options || {};
 		Store.call(this, options);

 		if (options.url) {
 			this.client = new Etcd(options.url, options.port || defaultPort);
 		}
 		else {
 			this.client = new Etcd(defaultHost, defaultPort);
 		}

 		this.ttl = options.ttl;
 	};

 	EtcdStore.prototype.__proto__ = Store.prototype;

 	EtcdStore.prototype.get = function(sid, fn) {
 		this.client.get(sid, function(err, data) {
 			if (err) return fn(err);
      		if (!data) return fn();

      		var result;
      		try {
      			result = JSON.parse(data.node.value);
      		}
      		catch(err){
      			return fn(err);
      		}

      		return fn(null, result);
 		});
 	};

 	EtcdStore.prototype.set = function(sid, sess, fn) {
 		try {
 			var maxAge = sess.cookie.maxAge
		        , ttl = this.ttl
		        , sess = JSON.stringify(sess);

		    ttl = ttl || ('number' == typeof maxAge
	          ? maxAge / 1000 | 0
	          : oneDay);

		    this.client.set(sid, sess, { ttl: ttl }, function(err) {
		    	fn && fn.apply(this, arguments);
		    });
 		} catch (err) {
 			fn && fn(err);
 		}
 	};

	EtcdStore.prototype.destroy = function(sid, fn) {
		this.client.del(sid, fn);
	};

	return EtcdStore;
 };