####################
# BASE IMAGE LAYER #
####################

# Specify the base image with a certain version and platform to be used for subsequent instructions
FROM --platform=linux/amd64 node:18.16.0-bookworm-slim AS base

# Update the list of available packages and install dumb-init, a process supervisor that forwards signals to children
RUN apt-get update && apt-get install -y dumb-init
# Set dumb-init as the entry point of the container. It deals with zombie processes and passes signals to the application process.
ENTRYPOINT ["dumb-init", "--"]

#####################
# BUILD IMAGE LAYER #
#####################

# Start a new stage for creating a build image
FROM base AS build
# Set the environment variable NODE_ENV to development
ENV NODE_ENV development
# Define the working directory for the container. This is the directory from which the instructions like RUN, CMD, ENTRYPOINT, COPY, and ADD will be executed.
WORKDIR /app

# Copy package.json and package-lock.json into the root directory of the container, and use chown option to change the owner to node.
COPY --chown=node:node package*.json ./
# Install all the dependencies and globally install typescript
RUN npm ci
# Copy the rest of the application source code into the container, using chown option to change the owner to node.
COPY --chown=node:node . .

# Compile TypeScript code to JavaScript
RUN npx tsc

##########################
# PRODUCTION IMAGE LAYER #
##########################

# Start a new stage for creating a production image
FROM base AS production

# Set the environment variable NODE_ENV to production.
ENV NODE_ENV=production
# Define the working directory
WORKDIR /app

# Copy package files from the previous build stage
COPY --from=build /app/package*.json ./
# Install only the production dependencies
RUN npm ci --only=production
# Copy the compiled JavaScript files from the previous build stage into the dist directory.
COPY --from=build /app/dist ./dist

# Change to a non-root user for security purposes
USER node
# Make the container's port 3000 available to the outside world. This is the port your app listens on.
EXPOSE 3000

# Run the server when the container launches
CMD [ "node", "dist" ]
