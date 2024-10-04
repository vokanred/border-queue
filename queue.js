export const QueueStatus = {
  NotRegistered: 'Not Registered',
  Registered: 'Registered',
  Called: 'Called',
  Unknown: 'Unknown',
  First50: 'First 50',
  First100: 'First 100'
};

export const getCarStatus = (queue, regNumber) => {
  const car = queue.find((c) => c.regnum === regNumber);
  if (!car) {
    return {
      status: QueueStatus.NotRegistered
    };
  }

  if (car.status === 2) {
    if (car.order_id <= 50) {
      return QueueStatus.First50;
    }

    if (car.order_id <= 100) {
      return QueueStatus.First100;
    }

    return QueueStatus.Registered;
  }

  if (car.status === 3) {
    return QueueStatus.Called;
  }

  return QueueStatus.Unknown;
}

export const getQueue = async () => {
  const response = await fetch(process.env.QUEUE_DATA_URL);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = await response.json();
  return data.carLiveQueue;
};
