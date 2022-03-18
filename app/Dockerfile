# Using Node:14.15.0 Image Since it contains all 
# the necessary build tools required for dependencies with native build (node-gyp, python, gcc, g++, make)
# First Stage : to install and build dependences

FROM node:14.15.0 as builder
WORKDIR /app
COPY ./package.json ./
RUN NODE_ENV=development npm install 
COPY . .
RUN npm run build

# Second Stage : Setup command to run your app using lightweight node image 
# 100mb lower than direct build
FROM mhart/alpine-node:14.15.0 as development
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start"]



############## Old Version ##############
# FROM mhart/alpine-node:14.15.0 as development

# WORKDIR /usr/src/app

# COPY package.json ./

# #RUN apk add --no-cache make gcc g++
# ##RUN npm install -g @nestjs/cli 
# RUN NODE_ENV=development npm install 

# COPY . .

# CMD ["npm", "run", "start"]

# #FROM mhart/alpine-node:latest as production
# #
# #ARG NODE_ENV=production
# #ENV NODE_ENV=${NODE_ENV}
# #
# #WORKDIR /usr/src/app
# #
# #COPY package.json ./
# #
# #RUN npm install --only=production
# #
# #COPY . .
# #
# #RUN npm build
# #
# #COPY /usr/src/app/dist ./dist
# #
# #CMD ["node", "dist/main"]
