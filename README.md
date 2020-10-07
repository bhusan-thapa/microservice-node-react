# Ecommerce 2.0
 The project uses **React** in frontend and **Node Express** in backend.
 The system uses **Microservice** based architecture.
 All services including the React runs inside **Kubernetes** cluster.

## Running in Development Environment
 Move inside the [services](https://gitlab.com/ecommerce2-0/e-commerce20/-/tree/dev/services) folder and run the follwing command
  ```bash
  skaffold dev
  ```
## Run Test 
```bash
npm test
```
 ## Prerequisite Installation for Developement Environment

 1. Install [Docker](https://docs.docker.com/get-docker/)
 Build docker image:
 ```bash
 docker build -t <tagname> .
```
 2. From the Docker  settings enable [Kubernetes] (https://kubernetes.io/)
 Deploy Kubernetes
 ```bash
 kubernetes apply -f <deployment-file>.yaml
 ```
 3. Install [Ingress-Nginx](https://kubernetes.github.io/ingress-nginx/deploy/)
 4. Install [Skaffold](https://skaffold.dev/docs/install/)

 ## Storing Environment Variable with Kubernetes
 The Auth server uses **JWT_KEY** which can be accessed using Env variable <br>
 Below is an example of storing a generic secret key value pair in Kubernetes.
 ```bash
 kubectl create secret generic jwt-secret --from-literal=<keyname>=<value>
 ```

 
