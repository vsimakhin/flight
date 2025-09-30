# Builder image
FROM alpine AS flightbuilder

WORKDIR /flight

RUN apk update --no-cache && \
    apk add ca-certificates libssl3 openssl curl jq

ARG TARGETARCH

RUN LATEST_RELEASE=$(curl --silent "https://api.github.com/repos/vsimakhin/flight/releases/latest" | \
    jq -r ".assets[] | select(.name == \"flight-linux-$TARGETARCH.tar.gz\") | .browser_download_url") && \
    curl -L -o flight.tar.gz $LATEST_RELEASE && \
    tar -xzf flight.tar.gz && \
    cp ./flight-linux-${TARGETARCH}/flight ./ && \
    rm -rf flight.tar.gz flight-linux-${TARGETARCH}

# Final image
FROM alpine

LABEL org.opencontainers.image.source="https://github.com/vsimakhin/flight" \
    org.opencontainers.image.authors="Vladimir Simakhin" \
    org.opencontainers.image.title="Flight" \
    org.opencontainers.image.description="Container image for https://github.com/vsimakhin/flight"

WORKDIR /flight

RUN apk update --no-cache && \
    apk add ca-certificates libssl3 openssl && \
    adduser -g "Flight" -s /usr/sbin/nologin -D -H flight && \
    chown -R flight /flight

COPY --from=flightbuilder /flight/flight /flight/flight

VOLUME [ "/data", "/certs" ]

EXPOSE 4000

USER flight
ENTRYPOINT ["./flight" ]