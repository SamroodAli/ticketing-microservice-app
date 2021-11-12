# Ticketing Microservices application

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

1. auth - Authentication server
   - TechStack: Express, MongoDB
2. tickets - Tickets resource server
   - TechStack: Express, MongoDB
