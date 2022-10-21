# Build
FROM golang:1.19 AS build

COPY go.mod go.sum *.go /go/src/

WORKDIR /go/src

RUN go mod download

RUN go build -o /go/bin/graph-app

# Deploy
FROM gcr.io/distroless/base-debian11:nonroot
#FROM debian:11

ENV METEO_API_TOKEN=""

WORKDIR /go

COPY --from=build /go/bin/graph-app /go/graph-app
COPY static /go/static
COPY templates /go/templates

EXPOSE 8080

USER nonroot:nonroot

ENTRYPOINT ["/go/graph-app"]