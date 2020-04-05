FROM node:12
RUN mkdir -p /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
COPY . .
RUN rm .npmrc
CMD ["npm", "run", "start"]
