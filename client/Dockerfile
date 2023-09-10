FROM node:alpine
WORKDIR /app
COPY client/package.json ./
COPY client/yarn.lock ./
RUN yarn
# copy all files
COPY client/ ./
EXPOSE 3000
EXPOSE 3010
CMD yarn dev