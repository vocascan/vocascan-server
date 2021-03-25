FROM node:14-alpine

WORKDIR /app

COPY package* ./

RUN npm i

COPY . .

# Run the image as a non-root user
RUN adduser -D vocascan
USER vocascan

CMD ["npm", "run", "start"]
