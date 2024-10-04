import 'dotenv/config'

import { Monitoring } from './monitoring.js';
import { sendEmail } from './email.js';

const monitoring = new Monitoring();

monitoring.watch('8602MM1', (status) => {
  sendEmail(status);
});

monitoring.schedule();
