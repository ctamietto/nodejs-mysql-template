FROM node:24-bookworm

WORKDIR /app

COPY . /app

RUN apt update -y 
RUN apt upgrade -y
RUN apt install vim less -y
RUN yarn install

EXPOSE 3000/tcp

ENTRYPOINT ["/app/startup.sh"]
 
