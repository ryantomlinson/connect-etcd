var assert = require('assert'),
	session = require('express-session'),
	EtcdStore = require('./')(session);

var store = new EtcdStore;

store.set('123', { cookie: { maxAge: 100000 }, name: 'ryan' }, function(err, ok){
	assert.ok(!err, '#set() got an error');
	assert.ok(ok, '#set() is not ok');

	store.get('123', function(err, data) {
		assert.ok(!err, '#get() got an error');
      	assert.deepEqual({ cookie: { maxAge: 100000 }, name: 'ryan' }, data);

		store.set('123', { cookie: { maxAge: 100000 }, name: 'ryan' }, function(){
	        store.destroy('123', function(){
		         console.log('done');
		         process.exit(0);
	        });
	    });
    });
});
