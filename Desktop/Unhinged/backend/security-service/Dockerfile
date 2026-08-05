FROM rust:1.70 as builder

WORKDIR /app
COPY . .
RUN cargo install --path .

FROM debian:bookmark-slim

WORKDIR /app
COPY --from=builder /usr/local/cargo/bin/unhinged-security /usr/local/bin/unhinged-security

EXPOSE 8000

CMD ["unhinged-security"]