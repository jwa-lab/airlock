# Airlock

The JWA Platform is hermetically sealed to reduce the attack surface, the Airlock is the only way in or out.

## What is this?

The Airlock provides an HTTP/REST-like<->NATS.io bridge and an authentication layer. Airlock users may only subscribe to or publish on topics they are authorized to use.

#### An HTTP/REST-like<->NATS.io bridge?

A NATS.io server is running inside a private network and is only accessible by approved NATS client. NATS clients are essentially all JWA services sharing data via NATS. NATS is used as a service mesh and the JWA platform follows a microservices pattern.
To access services inside the JWA platform, Airlock registers itself as another NATS client within the platform with special access rights. It will then accept incoming REST requests just like any ingress service, and translate them to their equivalent NATS requests.
Airlock currently support request/reply but will eventually also support WebSockets and client/server streaming.

## Test

1. First, start NATS & the mock Auth service:

```
docker-compose up
```

2. Then start the mock service

```
node tests/mocks/mockService.js
```

3. Then, set the following environment variables and start airlock

```
AUTH_URL=localhost:8999
AUTH_PROTOCOL=http
SECURE=false
NATS_URL=nats://localhost:4222

npm run dev
```

4. Finally, run the tests

```
npm run test
```
