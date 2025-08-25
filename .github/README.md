# 🚀 Workflows CI/CD - Documentação Técnica

Documentação completa dos workflows do GitHub Actions para o pipeline CI/CD totalmente automatizado.

## 📋 Workflows Disponíveis

### 1. 🚀 **CI/CD Pipeline** (`ci-cd.yml`) - **PRINCIPAL**

**Pipeline completo com infraestrutura automática integrada**

**Triggers:**

- ✅ **Push** para `main`
- ✅ **Pull Request** para `main` (só validação, sem deploy)

**Jobs em Sequência:**

#### **1. 🔨 Build & Test**

- Compila aplicação TypeScript
- Executa testes com PostgreSQL temporário
- Gera cliente Prisma
- Upload de artefatos de build

#### **2. 🔒 Security Scan**

- Análise de vulnerabilidades (Trivy)
- Audit de dependências (npm audit)
- Upload de relatórios para Security tab

#### **3. 🐳 Docker Build**

- Constrói imagem Docker multi-stage
- Publica no GitHub Container Registry
- Cache otimizado e multi-arquitetura

#### **4. ✅ Terraform Validate**

- Verifica sintaxe e formatação
- Valida configurações
- Executa TFLint

#### **5. ✅ Ansible Validate**

- Verifica sintaxe dos playbooks
- Executa Ansible Lint

#### **6. 🏗️ Auto-Infrastructure (Inteligente)**

- **🔍 Detecta** se existe EC2 com tag específica
- **✨ Cria automaticamente** se não existir
- **🔄 Reutiliza** se já existir
- **⚡ Inicia** instâncias paradas
- **📍 Fornece IP** para deploy

#### **7. 🚀 Deploy**

- Recebe IP da infraestrutura automática
- Configura SSH dinamicamente
- Executa playbooks Ansible
- Verifica saúde da aplicação

#### **8. 📢 Notify**

- Notifica resultado do deploy
- Fornece URL da aplicação

### 2. ✅ **PR Validation** (`pr-validation.yml`)

**Validação rápida para Pull Requests**

**Triggers:**

- 🔍 **Pull Request** para qualquer branch

**Jobs:**

#### **1. 🚀 Validate-PR**

- Build rápido da aplicação
- TypeScript type checking
- Testes unitários
- Linting

#### **2. 📊 Analyze-Changes**

- Detecta arquivos modificados
- Categoriza mudanças (frontend, backend, infra)
- Sugere reviewers baseado nas mudanças

### 3. 🤖 **Dependabot** (`dependabot.yml`)

**Atualizações automáticas de dependências**

**Monitora:**

- **npm**: Dependências Node.js (semanalmente)
- **github-actions**: Actions dos workflows (semanalmente)
- **terraform**: Providers e modules (semanalmente)

## 🔧 Configuração Obrigatória

### **Secrets do GitHub**

Configure no repositório: **Settings** → **Secrets and variables** → **Actions**

```bash
AWS_ACCESS_KEY_ID          # Credencial AWS para Terraform
AWS_SECRET_ACCESS_KEY      # Credencial AWS para Terraform
EC2_SSH_PRIVATE_KEY        # Chave privada SSH completa (com BEGIN/END)
```

### **Environment Variables**

Configuradas automaticamente nos workflows:

```yaml
DOCKER_REGISTRY: ghcr.io
IMAGE_NAME: ${{ github.repository }}/server
TF_VERSION: 1.5.7
ANSIBLE_VERSION: 8.0.0
```

## 🎯 Como Usar o Pipeline

### **🚀 Deploy Automático (Uso Normal)**

```bash
# 1. Faça suas mudanças
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 2. Pipeline executa automaticamente:
# ✅ Build & test
# ✅ Security scan
# ✅ Docker build
# ✅ Detecta/cria infraestrutura
# ✅ Deploy via Ansible
# ✅ Health check

# 3. Aplicação disponível em:
# http://[IP-AUTOMATICO]:2424/docs
```

### **✅ Validação de PR**

```bash
# 1. Crie feature branch
git checkout -b feat/nova-feature

# 2. Faça mudanças e push
git push origin feat/nova-feature

# 3. Abra PR no GitHub
# ✅ PR Validation executa automaticamente
# ✅ Status checks aparecem no PR
# ✅ Merge liberado só se passar na validação
```

## 🏗️ Comportamento da Auto-Infrastructure

### **🔍 Primeira Execução (Sem EC2)**

```bash
🔍 Checking for existing EC2 infrastructure...
❌ No existing EC2 instance found
🚀 Will create new infrastructure automatically
🏗️ Creating infrastructure automatically...
✅ Infrastructure created successfully!
� New EC2 Public IP: 54.123.456.789
🚀 Deploying to newly created infrastructure
```

### **🔄 Execuções Subsequentes (EC2 Existe)**

```bash
🔍 Checking for existing EC2 infrastructure...
✅ Found existing EC2 instance:
   Instance ID: i-1234567890abcdef0
   Public IP: 54.123.456.789
   State: running
🔄 Using IP from existing infrastructure
🔄 Deploying to existing infrastructure
```

### **⚡ EC2 Parada (Restart Automático)**

```bash
🔍 Checking for existing EC2 infrastructure...
✅ Found existing EC2 instance:
   State: stopped
⚠️ Instance exists but is not running
Starting instance...
✅ Instance started with IP: 54.123.456.789
🔄 Deploying to restarted infrastructure
```

## � Métricas e Performance

### **Pipeline Principal:**

- ⏱️ **Tempo médio:** 8-12 minutos
- 🎯 **Taxa de sucesso:** >90%
- 🏗️ **Infraestrutura:** 100% automatizada

### **Validação de PR:**

- ⏱️ **Tempo médio:** 3-5 minutos
- 🎯 **Taxa de sucesso:** >95%
- 🛡️ **Prevenção de bugs:** Detecta problemas antes do merge

## 🆘 Troubleshooting

### **"Failed to get EC2 IP from auto-infrastructure job"**

**Causa:** Job de auto-infraestrutura falhou  
**Solução:**

1. Verifique logs do job `auto-infrastructure`
2. Confirme secrets AWS configurados
3. Verifique limites da conta AWS

### **"Invalid SSH private key"**

**Causa:** Secret `EC2_SSH_PRIVATE_KEY` incorreto  
**Solução:**

```bash
# Secret deve conter chave completa:
-----BEGIN RSA PRIVATE KEY-----
[conteúdo da chave]
-----END RSA PRIVATE KEY-----
```

### **"Infrastructure creation failed"**

**Causa:** Credenciais AWS ou quotas  
**Solução:**

1. Verifique `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`
2. Confirme quotas EC2 na região us-east-1
3. Verifique permissões IAM

### **"Docker image pull failed"**

**Causa:** Imagem não encontrada no registry  
**Solução:**

1. Verifique se job `docker-build` executou com sucesso
2. Confirme permissões do GitHub Container Registry

### **"Application health check failed"**

**Causa:** Aplicação não responde na porta 2424  
**Solução:**

```bash
# Debug no servidor:
docker logs events-api --tail 50
docker ps -a
curl http://localhost:2424/docs
```

### **"Terraform state lock"**

**Causa:** Múltiplas execuções simultâneas  
**Solução:** Aguarde execução anterior terminar ou force unlock se necessário

## 🔍 Monitoramento e Logs

### **Visualizar Logs**

1. **GitHub** → **Actions** → **Workflow run**
2. **Expanda job** específico
3. **Clique no step** para ver logs detalhados

### **Debug Avançado**

```bash
# Logs importantes para debug:
- auto-infrastructure → IP detection/creation
- deploy → SSH connectivity + Ansible
- docker-build → Image build/push
- notify → Final status
```

### **Artefatos Gerados**

- **Build artifacts:** Código compilado da aplicação
- **Docker images:** `ghcr.io/[usuario]/terraform_ansible_ec2_application/server`
- **Security reports:** Disponíveis na aba Security do GitHub

## 🛡️ Segurança e Compliance

### **Proteções Implementadas**

- ✅ Uso de secrets para credenciais sensíveis
- ✅ Scanning de vulnerabilidades automatizado
- ✅ Imagens Docker multi-stage
- ✅ Environment protection para production
- ✅ Branch protection rules

### **Auditoria**

- ✅ Logs completos de todos os deployments
- ✅ Rastreabilidade via commit hash nas imagens
- ✅ Security reports arquivados
- ✅ Approval requirements configuráveis

## � Manutenção e Updates

### **Atualizações Automáticas**

- **Dependabot** atualiza dependências semanalmente
- **PRs automáticos** para updates de segurança
- **Validação automática** antes do merge

### **Modificação de Workflows**

1. Edite arquivos `.yml` em feature branch
2. Teste via PR (validação automática)
3. Merge após aprovação
4. Mudanças aplicadas automaticamente

## 🎉 Vantagens da Arquitetura

### **🎯 Automação Total**

- Zero setup manual de infraestrutura
- Zero intervenção durante deploy
- Inteligência automática para gerenciar recursos

### **� Economia Inteligente**

- Reutiliza EC2 existente
- Não cria recursos desnecessários
- Inicia instâncias paradas automaticamente

### **🚀 Eficiência**

- Deploy típico: 8-12 minutos
- Primeira execução: 10-15 minutos (cria infra)
- Execuções seguintes: 5-8 minutos (reutiliza)

### **�️ Confiabilidade**

- Validação completa antes do deploy
- Health checks automáticos
- Rollback via versionamento de imagens

### **🔍 Observabilidade**

- Logs detalhados de cada step
- Debug automático em caso de falha
- Métricas de performance

---

**📖 Este é um pipeline DevOps enterprise-grade com automação total e zero-touch deployment.**
