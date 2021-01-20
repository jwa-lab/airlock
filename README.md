# Airlock

The JWA Platform is hermetically sealed to reduce the attack surface, the Airlock is the only way in or out.

## What is this?

The Airlock provides an gRPC<->NATS.io bridge and an authentication layer. Airlock users may only subscribe to or publish on topics they are authorized to use.

#### A gRPC<->NATS.io bridge?

A NATS.io server is running inside a private network and is only accessible by approved NATS client. NATS clients are essentially all JWA services sharing data via NATS. NATS is used as a service mesh and the JWA platform follows a microservices pattern.

## Test

1. First, start NATS:

```
docker-compose up
```

2. Then start the mock service

```
node tests/mocks/mockServices.ts
```

3. Then start airlock

```
npm run dev
```

4. Finally, run the tests

```
npm run test
```
