FROM mcr.microsoft.com/dotnet/sdk:7.0

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Install Angular CLI
RUN npm install -g @angular/cli

# Install GitHub CLI
RUN sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0 && sudo apt-add-repository https://cli.github.com/packages && sudo apt update && sudo apt install gh


