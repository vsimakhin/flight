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

ARG TARGETARCH

COPY ./dist/flight-linux-${TARGETARCH}/flight /flight/flight

VOLUME [ "/data", "/certs" ]

EXPOSE 4000

USER flight
ENTRYPOINT ["./flight" ]