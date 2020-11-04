FROM ubuntu:20.04

### base
USER root
RUN apt-get update -y \
 && apt-get install -yq wget sudo curl nginx vim nano locales \
 && locale-gen en_US.UTF-8 \
 && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
 && apt-get install -yq \
     nodejs \
 && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* \
 && npm i -g yarn typescript
ENV LANG=en_US.UTF-8

### Remove after release
RUN mkdir -p "/opt/eosio/binaries"
COPY ./binaries /opt/eosio/binaries

### eosio
#RUN wget https://github.com/EOSIO/eos/releases/download/v2.0.0/eosio_2.0.0-1-ubuntu-18.04_amd64.deb \
# && apt-get update && sudo apt install -y ./eosio_2.0.0-1-ubuntu-18.04_amd64.deb \
# && rm ./eosio_2.0.0-1-ubuntu-18.04_amd64.deb
RUN apt-get update \
 && sudo apt-get install -y /opt/eosio/binaries/eosio_2.1.0-alpha2_amd64.deb \
 && rm /opt/eosio/binaries/eosio_2.1.0-alpha2_amd64.deb

### CDT
#RUN wget https://github.com/EOSIO/eosio.cdt/releases/download/v1.7.0/eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb \
# && apt-get update && sudo apt install -y ./eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb \
# && rm ./eosio.cdt_1.7.0-1-ubuntu-18.04_amd64.deb
RUN apt-get update \
 && sudo apt-get install -y /opt/eosio/binaries/eosio.cdt_1.7.0-develop_amd64.deb \
 && rm /opt/eosio/binaries/eosio.cdt_1.7.0-develop_amd64.deb

RUN echo "COPYING APP CONTRACTS"
RUN mkdir -p "/opt/eosio/bin/contracts"
COPY ./contracts /opt/eosio/bin/contracts
COPY ./deploy_contracts.sh /opt/eosio/bin/

RUN echo "DEPLOYING CONTRACTS"
RUN mkdir -p "/opt/eosio/bin/config-dir"
RUN /bin/bash /opt/eosio/bin/deploy_contracts.sh
