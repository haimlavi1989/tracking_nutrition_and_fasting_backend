FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Copy the .env file to the container
COPY ./config/.env.dev ./config/.env

EXPOSE 3000

CMD ["npm", "start"]
