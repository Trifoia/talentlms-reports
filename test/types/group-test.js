'use strict';

const assert = require('assert').strict;

const group = require('../../src/types/group.js');

describe('group', function() {
  const groupId = '3';
  const courseId = '135';
  const groupInfo = {
    id: groupId,
    name: 'groupName',
    users: [{id: '1',}, {id: '2',}],
    courses: [{id: courseId}]
  };

  const debugSdk = {
    user: {
      all: () => {
        return [
          {
            id: '1',
            email: 'email1',
            first_name: 'firstName1',
            last_name: 'lastName1',
            created_on: 'createdOn1',
            last_updated: 'lastUpdated1'
          },
          {
            id: '2',
            email: 'email2',
            first_name: 'firstName2',
            last_name: 'lastName2',
            created_on: 'createdOn2',
            last_updated: 'lastUpdated2'
          }
        ];
      }
    },
    group: {
      retrieve: (id) => {
        assert.equal(id, groupId);
        return groupInfo;
      }
    },
    course: {
      retrieve: (id) => {
        assert.equal(id, courseId);
        return {
          id: courseId,
          name: 'courseName',
          users: [
            {
              id: '1',
              completion_percentage: 'completionPercentage1',
              completed_on: ''
            },
            {
              id: '2',
              completion_percentage: 'completionPercentage2',
              completed_on: 'completedOn2'
            }
          ]
        };
      }
    }
  };

  it('should generate a group report data object', async () => {
    const result = await group({
      groupId,
      sdk: debugSdk
    });

    assert.equal(result.group, groupInfo);

    assert.equal(result.results[0].id, '1');
    assert.equal(result.results[0].email, 'email1');
    assert.equal(result.results[0].fullName, 'firstName1 lastName1');
    assert.equal(result.results[0].createdOn, 'createdOn1');
    assert.equal(result.results[0].lastLogin, 'lastUpdated1');
    assert.equal(result.results[0].groupName, 'groupName');
    assert.equal(result.results[0].courses[0].id, courseId);
    assert.equal(result.results[0].courses[0].name, 'courseName');
    assert.equal(result.results[0].courses[0].completionPercentage, 'completionPercentage1');
    assert.equal(result.results[0].courses[0].completedOn, '');

    assert.equal(result.results[1].id, '2');
    assert.equal(result.results[1].email, 'email2');
    assert.equal(result.results[1].fullName, 'firstName2 lastName2');
    assert.equal(result.results[1].createdOn, 'createdOn2');
    assert.equal(result.results[1].lastLogin, 'lastUpdated2');
    assert.equal(result.results[1].groupName, 'groupName');
    assert.equal(result.results[1].courses[0].id, courseId);
    assert.equal(result.results[1].courses[0].name, 'courseName');
    assert.equal(result.results[1].courses[0].completionPercentage, 'completionPercentage2');
    assert.equal(result.results[1].courses[0].completedOn, 'completedOn2');
  });

  it('should give useful error if group cannot be found', async () => {
    const noGroupError = {
      type: 'invalid_request_error',
      message: 'The requested group does not exist'
    };
    debugSdk.group.retrieve = () => {
      return {
        error: noGroupError
      };
    };

    const result = await group({
      groupId,
      sdk: debugSdk
    });
    
    assert.equal(result.error.type, noGroupError.type);
    assert.equal(result.error.message, noGroupError.message);
  });
});
