# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy projects
COPY rebisco-bugtracker.Api/ ./rebisco-bugtracker.Api/
COPY rebisco-bugtracker.Tests/ ./rebisco-bugtracker.Tests/

# Restore API
WORKDIR /src/rebisco-bugtracker.Api
RUN dotnet restore rebisco-bugtracker.Api.csproj

# Restore Tests
WORKDIR /src/rebisco-bugtracker.Tests
RUN dotnet restore rebisco-bugtracker.Tests.csproj

# IMPORTANT: switch back to API before publish
WORKDIR /src/rebisco-bugtracker.Api
RUN dotnet publish rebisco-bugtracker.Api.csproj \
    -c Release \
    -o /app/publish

# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .
EXPOSE 5032
ENTRYPOINT ["dotnet", "rebisco-bugtracker.Api.dll"]
