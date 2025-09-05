# terraform_ansible_ec2_application

[![CI/CD Pipeline](https://github.com/PedroBarros3421/terraform_ansible_ec2_application/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/PedroBarros3421/terraform_ansible_ec2_application/actions/workflows/ci-cd.yml)
[![Security Scan](https://github.com/PedroBarros3421/terraform_ansible_ec2_application/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/PedroBarros3421/terraform_ansible_ec2_application/actions/workflows/pr-validation.yml)

Este projeto demonstra a implementação de **Pipeline DevOps totalmente automatizado** utilizando Terraform, Ansible e Docker para provisionar e deploiar uma aplicação Node.js/TypeScript em instância EC2 na AWS, **com sistema completo de monitoramento**.

Desenvolvido como parte da **Pós-graduação em Engenharia de Software com DevOps - UNIFOR**.

## 🚀 Pipeline CI/CD Totalmente Automatizado

### ✨ **Zero-Touch Deployment**

**Faça um push → Aplicação deployada automaticamente!**

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
# 🎉 Pipeline cuida de TUDO automaticamente!
```

### 🏗️ **Auto-Infrastructure**

- ✅ **Detecta** automaticamente se existe infraestrutura
- ✅ **Cria EC2** se necessário (primeira execução)
- ✅ **Reutiliza** infraestrutura existente
- ✅ **Zero configuração manual**

### 📋 **Workflows Disponíveis**

#### 🚀 **CI/CD Pipeline** (Principal)

- **Build & Test** → Compila TypeScript, executa testes
- **Security Scan** → Trivy + npm audit
- **Docker Build** → Publica no GitHub Container Registry
- **Auto Infrastructure** → Cria/detecta EC2 automaticamente
- **Deploy** → Ansible + Docker deployment
- **Health Check** → Verifica aplicação funcionando

#### ✅ **PR Validation**

- **Validação rápida** para Pull Requests
- **Quality gates** antes do merge

## 📊 **Sistema de Monitoramento**

### 🎯 **Componentes**

- **Prometheus** - Coleta e armazena métricas
- **Grafana** - Visualização e dashboards
- **Alertmanager** - Gerenciamento de alertas
- **Node Exporter** - Métricas do sistema

### 📈 **Métricas Coletadas**

- **HTTP Metrics**: Requisições, tempo de resposta, códigos de status
- **Business Metrics**: Eventos criados, participantes registrados
- **Error Metrics**: Tipos de erro, taxas de erro
- **System Metrics**: CPU, memória, disco

### 🚨 **Alertas Configurados**

- **Críticos**: Aplicação down, alta taxa de erro
- **Avisos**: Latência alta, muitas requisições
- **Informativos**: Eventos próximos da capacidade

### 🧪 **Teste Local**

```bash
cd server
npm run monitoring:start  # Inicia sistema local
npm run generate-load     # Gera carga de teste
```

**📖 Guia completo**: [MONITORING.md](./MONITORING.md)

## 🛠️ Tecnologias

- **🏗️ Terraform** - Infraestrutura como código (EC2, Security Groups)
- **⚙️ Ansible** - Configuração e deployment automatizado
- **🐳 Docker** - Containerização da aplicação
- **🚀 Node.js/TypeScript** - Runtime e linguagem
- **🗄️ PostgreSQL** - Banco de dados
- **📊 Prisma** - ORM para gerenciamento do banco
- **🔄 GitHub Actions** - Pipeline CI/CD
- **📈 Prometheus** - Coleta de métricas
- **📊 Grafana** - Visualização de dados
- **🚨 Alertmanager** - Gerenciamento de alertas

## 📐 Arquitetura

![Arquitetura do projeto](./Diagrama-arquitetura.svg)

**Componentes:**

- **GitHub Actions** → Build, test, deploy
- **AWS EC2** → Hospedagem da aplicação
- **Docker Compose** → PostgreSQL + Node.js app + Monitoramento
- **GitHub Container Registry** → Imagens Docker

## 📁 Estrutura do Projeto

```
├── .github/workflows/          # Pipelines CI/CD
│   ├── ci-cd.yml              # Pipeline principal
│   └── pr-validation.yml      # Validação de PRs
├── server/                     # Aplicação Node.js/TypeScript
│   ├── src/                   # Código fonte
│   ├── prisma/                # Schema e migrações DB
│   ├── scripts/               # Scripts de teste
│   ├── docker-compose.local.yml # Teste local
│   └── Dockerfile             # Container da aplicação
├── terraform/                  # Infraestrutura como código
│   ├── main.tf               # Configuração EC2
│   └── variables.tf          # Variáveis Terraform
├── ansible/                    # Automação de configuração
│   ├── playbook.yml          # Tasks de deployment
│   └── docker-compose-server.yml  # Orquestração containers
├── prometheus/                 # Configuração Prometheus
│   ├── prometheus.yml        # Configuração principal
│   └── alert.rules           # Regras de alerta
├── grafana/                    # Configuração Grafana
│   ├── provisioning/         # Datasources
│   └── dashboards/           # Dashboards
└── alertmanager/              # Configuração Alertmanager
    └── alertmanager.yml      # Configuração alertas
```

## 🎉 Resultados

### ✅ **Pipeline DevOps de Classe Mundial**

- **Automação total**: Zero intervenção manual
- **Intelligent Infrastructure**: Detecta e cria recursos automaticamente
- **Fast Feedback**: PRs validados em ~3-5 minutos
- **Reliable Deployments**: Health checks e rollback automático
- **Cost Effective**: Reutiliza recursos existentes

### 📊 **Métricas**

- ⏱️ **Deploy time**: 8-12 minutos (completo)
- 🎯 **Success rate**: >90%
- 🔒 **Security**: Scan automático de vulnerabilidades
- 💰 **Cost optimization**: Reuso inteligente de EC2

### 📈 **Monitoramento**

- 🔍 **Observabilidade completa**: Métricas, logs e alertas
- 📊 **Dashboards profissionais**: Visualizações em tempo real
- 🚨 **Alertas inteligentes**: Baseados em thresholds e tendências
- 📱 **Notificações**: Configuráveis para Slack, email, etc.

## 🏆 Características DevOps

- ✅ **Infrastructure as Code** (Terraform)
- ✅ **Configuration as Code** (Ansible)
- ✅ **Containerization** (Docker)
- ✅ **Automated Testing** (Jest + PostgreSQL)
- ✅ **Security Scanning** (Trivy)
- ✅ **GitOps Workflow** (GitHub Actions)
- ✅ **Monitoring & Health Checks**
- ✅ **Automated Rollback** capabilities
- ✅ **Observability Stack** (Prometheus + Grafana)
- ✅ **Alert Management** (Alertmanager)

---

**🎯 Objetivo:** Demonstrar pipeline DevOps enterprise-grade com automação total, zero-touch deployment e sistema completo de monitoramento.

**📖 Guia completo:** [Workflows Documentation](.github/README.md)

**📊 Monitoramento:** [MONITORING.md](./MONITORING.md)

**🧪 Teste Local:** [MONITORING-TEST.md](./server/MONITORING-TEST.md)

**🎓 Instituição:** UNIFOR - Pós-graduação Engenharia de Software com DevOps
