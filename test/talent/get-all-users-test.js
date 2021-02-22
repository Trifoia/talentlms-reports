'use strict';

const assert = require('assert').strict;

const getUsers = require('../../src/talent/get-all-users.js');

describe('get-users', function() {
  it('should get users', async () => {
    const actual = await getUsers({
      sdk: {
        user: {
          all: () => {
            return [
              'User 0',
              'User 1',
              'User 2',
            ];
          }
        }
      }
    });

    assert.equal(actual[0], 'User 0');
    assert.equal(actual[1], 'User 1');
    assert.equal(actual[2], 'User 2');
  });

  it('should get cached users', async () => {
    const actual = await getUsers({
      sdk: {
        user: {
          all: () => {
            return [
              'User null',
            ];
          }
        }
      }
    });

    assert.equal(actual[0], 'User 0');
    assert.equal(actual[1], 'User 1');
    assert.equal(actual[2], 'User 2');
  });

  it('should get users with cache disabled', async () => {
    const actual = await getUsers({
      sdk: {
        user: {
          all: () => {
            return [
              'User not cached 0',
              'User not cached 1',
              'User not cached 2',
            ];
          }
        }
      },
      cache: false
    });

    assert.equal(actual[0], 'User not cached 0');
    assert.equal(actual[1], 'User not cached 1');
    assert.equal(actual[2], 'User not cached 2');
  });

  it('should get freshly cached users', async () => {
    const actual = await getUsers({
      sdk: {
        user: {
          all: () => {
            return [
              'User null',
            ];
          }
        }
      }
    });

    assert.equal(actual[0], 'User not cached 0');
    assert.equal(actual[1], 'User not cached 1');
    assert.equal(actual[2], 'User not cached 2');
  });

  it('should clear cache explicitly', async () => {
    getUsers.clear();
    const actual = await getUsers({
      sdk: {
        user: {
          all: () => {
            return [
              'User 0',
              'User 1',
              'User 2',
            ];
          }
        }
      }
    });

    assert.equal(actual[0], 'User 0');
    assert.equal(actual[1], 'User 1');
    assert.equal(actual[2], 'User 2');
  });

  after(() => {
    getUsers.clear();
  });
});
