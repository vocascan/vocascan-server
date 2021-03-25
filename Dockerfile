FROM node:14-alpine

RUN apk add --no-cache --update curl bash
WORKDIR /app

ARG NODE_ENV=development
ARG PORT=3000
ENV PORT=$PORT

COPY package* ./
# Install the npm packages
RUN npm install && npm update

COPY . .

# Run the image as a non-root user
RUN adduser -D vocascan
USER vocascan

EXPOSE $PORT

CMD ["npm", "run", "start"]
