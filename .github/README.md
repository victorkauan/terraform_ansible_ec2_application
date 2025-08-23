# GitHub Actions CI/CD Pipeline

Este diretório contém os workflows do GitHub Actions para automatizar o pipeline de CI/CD do projeto.

## 📋 Workflows Disponíveis

### 1. CI/CD Pipeline (`ci-cd.yml`)

Pipeline principal que executa em pushes para `main` e `develop`, e em Pull Requests.

**Etapas:**

- **Build & Test**: Compila a aplicação Node.js/TypeScript, executa testes
- **Security Scan**: Análise de vulnerabilidades com Trivy e npm audit
- **Docker Build**: Constrói e publica imagem Docker no GitHub Container Registry
- **Terraform Validate**: Valida configurações do Terraform
- **Ansible Validate**: Valida playbooks do Ansible
- **Deploy**: Provisiona infraestrutura e deploya aplicação (apenas branch `main`)
- **Notify**: Notifica status do deployment

### 2. PR Validation (`pr-validation.yml`)

Validação rápida para Pull Requests.

**Etapas:**

- Validação de sintaxe e build
- Análise de arquivos modificados
- Verificação de infraestrutura e configuração

### 3. Cleanup Resources (`cleanup.yml`)

Limpeza periódica de recursos.

**Funcionalidades:**

- Execução automática aos domingos (2:00 AM UTC)
- Execução manual via workflow_dispatch
- Limpeza de imagens Docker antigas
- Destruição de infraestrutura (opcional)

## 🔧 Configuração Necessária

### Secrets do GitHub

Configure os seguintes secrets no repositório:

```
AWS_ACCESS_KEY_ID          # Credencial AWS para Terraform
AWS_SECRET_ACCESS_KEY      # Credencial AWS para Terraform
EC2_SSH_PRIVATE_KEY        # Chave privada SSH para conectar na EC2
```

### Variables de Ambiente

As seguintes variáveis são configuradas nos workflows:

```
DOCKER_REGISTRY: ghcr.io
IMAGE_NAME: ${{ github.repository }}/server
TF_VERSION: 1.5.7
ANSIBLE_VERSION: 8.0.0
```

## 🚀 Como Usar

### Deploy Automático

1. Faça commit de mudanças na branch `main`
2. O pipeline executará automaticamente
3. A aplicação será deployada na AWS EC2

### Validação de PR

1. Crie um Pull Request para `main` ou `develop`
2. O workflow de validação será executado automaticamente
3. Verifique os resultados antes do merge

### Limpeza Manual

1. Vá para Actions no GitHub
2. Selecione "Cleanup Resources"
3. Clique em "Run workflow"
4. Marque "Destroy Terraform infrastructure" se necessário

## 📊 Monitoramento

### Status do Pipeline

- ✅ Verde: Pipeline executado com sucesso
- ❌ Vermelho: Falha no pipeline
- 🟡 Amarelo: Pipeline em execução

### Artefatos Gerados

- **Build artifacts**: Código compilado da aplicação
- **Docker images**: Imagens publicadas no GitHub Container Registry
- **Security reports**: Relatórios de vulnerabilidade no Security tab

## 🔍 Logs e Debug

### Visualizar Logs

1. Acesse a aba "Actions" no GitHub
2. Clique no workflow execution
3. Expanda os jobs e steps para ver logs detalhados

### Troubleshooting Comum

**Falha no Terraform:**

- Verifique se as credenciais AWS estão corretas
- Confirme se o arquivo `terraform.tfvars` existe
- Verifique quotas da AWS

**Falha no Ansible:**

- Confirme se a chave SSH está correta
- Verifique se a instância EC2 está acessível
- Confirme se o inventory.yml está atualizado

**Falha no Docker:**

- Verifique se o Dockerfile está correto
- Confirme se as dependências estão disponíveis
- Verifique permissões do GitHub Container Registry

## 🛡️ Segurança

### Boas Práticas Implementadas

- Uso de secrets para credenciais sensíveis
- Scanning de vulnerabilidades automatizado
- Imagens Docker multi-stage para reduzir superfície de ataque
- Environment protection para production

### Compliance

- Logs de auditoria completos
- Rastreabilidade de deployments
- Aprovação manual para production (configurável)

## 📈 Métricas

O pipeline coleta as seguintes métricas:

- Tempo de build
- Tempo de deploy
- Taxa de sucesso/falha
- Vulnerabilidades encontradas
- Cobertura de testes (quando disponível)

## 🔄 Atualizações

Para atualizar os workflows:

1. Edite os arquivos `.yml` conforme necessário
2. Teste em branch separada primeiro
3. Faça merge após validação

## 📞 Suporte

Para problemas com o pipeline:

1. Verifique os logs do workflow
2. Consulte a documentação do GitHub Actions
3. Verifique o status dos serviços AWS
