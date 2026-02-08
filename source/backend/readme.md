# Backend - Luxclusif

## Arquitetura e padroes
- Arquitetura hexagonal com 5 camadas/projetos: `Domain`, `Application`, `Infrastructure`, `Tests`, `API`.
- `Domain` contem entidades e validacoes de negocio.
- `Application` contem DTOs, interfaces (Abstractions) e casos de uso.
- `Infrastructure` contem repositorios Dapper, servicos externos e migrations.
- `API` expõe endpoints e consome apenas casos de uso.
- Padroes aplicados: Repository, Unit of Work, DTO, Dependency Injection, Single Responsibility, Interface Segregation.

## Persistencia e migrations
- Banco: PostgreSQL via Dapper.
- Migrations SQL ficam em `Luxclusif.Backend.Infrastructure/Migrations` e sao executadas no startup pela `MigrationRunner`.

## Configuracoes e credenciais
Os arquivos obrigatorios ficam no projeto API:
- `app.settings.json`
- `app.settings.release.json`

Parametros principais:
- `ConnectionStrings:Postgres` para o banco.
- `GoogleDrive` e `GoogleSheet` para integracoes.

## Como executar
1. Configure `ConnectionStrings:Postgres`.
2. Rode a API:
   - `dotnet run --project Accessories-Assessment/source/backend/Luxclusif.Backend.Api`
3. Swagger disponivel em `/swagger` (ambiente Development).
