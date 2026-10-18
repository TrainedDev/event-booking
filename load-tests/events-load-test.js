
import http from "k6/http";
import { check, sleep } from "k6";

// Replace this with your actual GET event-list endpoint.
const API_URL =
  "https://event-booking-xt9t.onrender.com/api/v1/events";
  
export const options = {
  stages: [
    { duration: "10s", target: 5 },
    { duration: "15s", target: 10 },
    { duration: "10s", target: 20 },
    { duration: "5s", target: 0 },
  ],
};

export default function () {
  const response = http.get(API_URL, {
    tags: { endpoint: "event-list" },
  });

  check(response, {
    "status is 200": (r) => r.status === 200,
    "response is under 2 seconds": (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
