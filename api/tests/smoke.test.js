const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");

process.env.NODE_ENV = "test";
process.env.GEMINI_API_KEY = "";
process.env.GOOGLE_GEMINI_API_KEY = "";
process.env.OPENWEATHER_API_KEY = "";

const { app } = require("../index");

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  return {
    status: response.status,
    body: await response.json(),
  };
};

test("health endpoint reports OK", async () => {
  const { status, body } = await requestJson("/api/health");

  assert.equal(status, 200);
  assert.equal(body.status, "OK");
});

test("adventure listing supports activity and budget filters", async () => {
  const { status, body } = await requestJson(
    "/api/adventures?activity=trekking&budget=9000"
  );

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.ok(body.count > 0);
  assert.ok(
    body.data.every((destination) =>
      destination.activities.some((activity) =>
        activity.toLowerCase().includes("trekking")
      )
    )
  );
});

test("weather endpoint returns demo data when no API key is configured", async () => {
  const { status, body } = await requestJson("/api/weather?location=Manali");

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.mock, true);
  assert.equal(body.data.location, "Manali");
  assert.equal(typeof body.data.temperature, "number");
});

test("generate-plan returns demo itinerary when no Gemini key is configured", async () => {
  const { status, body } = await requestJson("/api/adventures/generate-plan", {
    method: "POST",
    body: JSON.stringify({
      location: "Manali",
      budget: "12000",
      days: 2,
      activities: ["Trekking", "Camping"],
    }),
  });

  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.demo, true);
  assert.equal(body.data.days.length, 2);
});

test("generate-plan rejects invalid trip duration", async () => {
  const { status, body } = await requestJson("/api/adventures/generate-plan", {
    method: "POST",
    body: JSON.stringify({
      location: "Manali",
      budget: "12000",
      days: 0,
    }),
  });

  assert.equal(status, 400);
  assert.equal(body.success, false);
});

test("protected auth route rejects missing tokens", async () => {
  const { status, body } = await requestJson("/api/auth/me");

  assert.equal(status, 401);
  assert.equal(body.success, false);
});
