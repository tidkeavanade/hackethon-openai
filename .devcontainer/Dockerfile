FROM mcr.microsoft.com/dotnet/sdk:7.0

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Install Angular CLI
RUN npm install -g @angular/cli

# Install Github CLI
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0 \
    && apt-add-repository https://cli.github.com/packages \
    && apt update \
    && apt install -y gh

# Copy scripts and make them executable
COPY ./sh-scripts ./sh-scripts
RUN chmod -R +x ./sh-scripts
