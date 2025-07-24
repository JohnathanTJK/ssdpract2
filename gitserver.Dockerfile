FROM node:alpine

# Install dependencies and global package
RUN apk add --no-cache tini git \
  && yarn global add git-http-server \
  && adduser -D -g git git

# Switch to the 'git' user
USER git

# Set the working directory
WORKDIR /home/git

# Initialize a bare Git repository
RUN git init --bare repository.git

# Set the container's entrypoint
ENTRYPOINT ["tini", "--", "git-http-server", "-p", "3000", "/home/git"]
