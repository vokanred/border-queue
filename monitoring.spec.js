import { jest } from '@jest/globals';
import { EventType } from './event-type.js';
import { QueueStatus } from './queue-status.js';

jest.unstable_mockModule('node-schedule', () => ({
  scheduleJob: (_, job) => job()
}))

const getQueueMock = jest.fn().mockResolvedValue([]);
jest.unstable_mockModule('./queue.js', () => ({
  getQueue: getQueueMock
}));

const { Monitoring } = await import('./monitoring.js');

describe('Monitoring', () => {
  const regNumber = '0000AA0';

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('Car is not registered', (done) => {
    getQueueMock.mockResolvedValue([]);

    const monitoring = new Monitoring();
    monitoring.watch(regNumber, (e) => {
      expect(e).toEqual({
        type: EventType.CarNotRegistered
      });
      done();
    });
    monitoring.start();
  });

  test('Car is called', (done) => {
    getQueueMock.mockResolvedValue([{
      regNumber,
      status: QueueStatus.Called,
      updatedAt: new Date()
    }]);

    const monitoring = new Monitoring();
    monitoring.watch(regNumber, (e) => {
      expect(e).toEqual({
        type: EventType.CarCalled
      });
      done();
    });
    monitoring.start();
  });

  test('Car has unknown queue status', (done) => {
    const status = 1;

    getQueueMock.mockResolvedValue([{
      regNumber,
      status,
      updatedAt: new Date()
    }]);

    const monitoring = new Monitoring();
    monitoring.watch(regNumber, (e) => {
      expect(e).toEqual({
        type: EventType.UnknownStatus,
        status
      });
      done();
    });
    monitoring.start();
  });
});
