# Ticketing Microservices application

A full stack web application built with microservices architecture. A user is able to signup/signin and sell/buy tickets. Tickets order results in a short expiration window where they can pay for it before the order expires. Pay for the tickets with Stripe.

# Stack

Frontend: NextjS
Devops: Kubernetes cluster with docker images
Local Dev: Skaffold
Event Bus: NATs

# Architecture decisions

1. NextJS for server side rendering.
2. Typescript for the backend services.
3. Common code in shared npm package.
4. Database per service.
5. Asynchronous communication with NATs event bus.

# Kubernetes objects

1. Ingress-nginx for routing.
2. Docker containers running in pods.
3. Deployment for managing pods.
4. ClusterIp services for virtual ip.

## Services

1. Auth - Authentication server
   - TechStack: Express, MongoDB
2. Tickets - Tickets resource service
   - TechStack: Express, MongoDB
3. Orders - Order Resource service
   - TechStack: Express, MongoDB
4. Payments - Stripe payment service
   - TechStack: Expresss, MongoDB
5. Client - Nextjs frontend client
   - TechStack: Nextjs
6. Expiration - Order expiration service
   - TechStack: Express,bull,Redis
