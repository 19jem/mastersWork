import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 50,         // одночасних користувачів (virtual users)
  duration: '10s', // тривалість тесту
};

export default function () {
  // 1️⃣ простий GET-запит до API
  http.get('http://localhost:3001/api/products');
  sleep(1); // пауза між запитами (імітує "людину")
}
