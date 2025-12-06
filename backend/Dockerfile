FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 7000
EXPOSE 7001

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["WatchStore.API/WatchStore.API.csproj", "WatchStore.API/"]
COPY ["WatchStore.Application/WatchStore.Application.csproj", "WatchStore.Application/"]
COPY ["WatchStore.Domain/WatchStore.Domain.csproj", "WatchStore.Domain/"]
COPY ["WatchStore.Infrastructure/WatchStore.Infrastructure.csproj", "WatchStore.Infrastructure/"]
COPY ["WatchStore.Common/WatchStore.Common.csproj", "WatchStore.Common/"]

RUN dotnet restore "WatchStore.API/WatchStore.API.csproj"
COPY . .
WORKDIR "/src/WatchStore.API"
RUN dotnet build "WatchStore.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WatchStore.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WatchStore.API.dll"]
