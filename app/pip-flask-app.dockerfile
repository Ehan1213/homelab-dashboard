# FROM ghcr.io/astral-sh/uv:python3.13-trixie-slim AS builder
FROM python:3.13-alpine AS builder


WORKDIR /app

# ENV UV_NO_DEV=1
RUN python -m venv .venv

# RUN source .venv/bin/activate

ENV PATH="/app/.venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# COPY pyproject.toml uv.lock ./

# RUN uv sync --frozen

FROM python:3.13-alpine AS runtime
RUN pip install --no-cache-dir gunicorn

WORKDIR /app
COPY --from=builder /app/.venv .venv
ENV PATH="/app/.venv/bin:$PATH"
RUN source .venv/bin/activate
COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app.run:app"]