'use strict';

const assert = require('assert').strict;

const getCourse = require('../../src/talent/get-course.js');

describe('get-course', function() {
  const courseId = 3;

  it('should get course', async () => {
    const actual = await getCourse({
      sdk: {
        course: {
          retrieve: (id) => {
            assert.equal(id, courseId);

            return 'course info';
          }
        }
      },
      courseId,
    });

    assert.equal(actual, 'course info');
  });

  it('should get cached course', async () => {
    const actual = await getCourse({
      sdk: {
        course: {
          retrieve: (id) => {
            assert.equal(id, courseId);

            return 'null course info';
          }
        }
      },
      courseId,
    });

    assert.equal(actual, 'course info');
  });

  it('should get course with cache disabled', async () => {
    const actual = await getCourse({
      sdk: {
        course: {
          retrieve: (id) => {
            assert.equal(id, courseId);

            return 'cache course info';
          }
        }
      },
      courseId,
      cache: false,
    });

    assert.equal(actual, 'cache course info');
  });

  it('should get freshly cached course', async () => {
    const actual = await getCourse({
      sdk: {
        course: {
          retrieve: (id) => {
            assert.equal(id, courseId);

            return 'null course info';
          }
        }
      },
      courseId,
    });

    assert.equal(actual, 'cache course info');
  });

  it('should explicitly clear cache', async () => {
    getCourse.clear();
    const actual = await getCourse({
      sdk: {
        course: {
          retrieve: (id) => {
            assert.equal(id, courseId);

            return 'cleared course info';
          }
        }
      },
      courseId,
    });

    assert.equal(actual, 'cleared course info');
  });
});
