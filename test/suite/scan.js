var assert = require('assert'),
    scan = require('../../index');

describe('scan', function() {
  it('calls back with active port', function(done) {
    var successes = 0;
    scan(0, {
      findOne: true,
      success: function() {
        successes++;
      },
      complete: function(stats) {
        assert.equal(stats.successes, 1);
        assert.equal(stats.successes, successes);
        done();
      }
    });
  });

  it('calls back with first inactive port', function(done) {
    var successes = 0;
    scan(0, {
      findActive: false,
      findOne: true,
      success: function() {
        successes++;
      },
      complete: function(stats) {
        assert.equal(stats.successes, 1);
        assert.equal(stats.successes, successes);
        done();
      }
    });
  });

  it('calls back with high failures and no successes due to artificially large inactive port', function(done) {
    var successes = 0;
    var failures = 0;
    scan(1000000, {
      success: function() {
        successes++;
      },
      failure: function() {
        failures++;
      },
      complete: function(stats) {
        assert.equal(stats.successes, 0);
        assert.ok(stats.failures >= 1);
        assert.equal(successes, 0);
        assert.equal(stats.failures, failures);
        done();
      }
    });
  });
});
