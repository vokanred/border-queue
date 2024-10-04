import { createApp, ref, onMounted } from "vue";

const QUEUE_URL = 'https://belarusborder.by/info/monitoring-new?token=test&checkpointId=a9173a85-3fc0-424c-84f0-defa632481e4';

const getQueue = async () => {
  const response = await fetch(QUEUE_URL);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const data = await response.json();
  return data.carLiveQueue;
}

const getCar = async (regNumber) => {
  const queue = await getQueue();
  const car = queue.find((c) => c.regnum === regNumber);

  return car ? {
    order: car.order_id,
    changedAt: car.changed_date,
    status: car.status,
    regNumber: car.regnum
  } : null;
}

createApp({
  setup() {
    const car = ref(undefined);
    const updatedAt = ref(undefined);

    const load = async () => {
      const params = new URLSearchParams(window.location.search);
      const regNumber = params.get('regNumber').toUpperCase();

      car.value = await getCar(regNumber);
      updatedAt.value = new Date().toLocaleTimeString();
    }

    onMounted(() => {
      load();
    })

    return {
      car,
      updatedAt
    };
  }
}).mount("#app");
