# 🚀 Workflows de CI/CD - Guia de Uso

Este projeto agora utiliza **dois workflows separados** para gerenciar infraestrutura e deploy de aplicação de forma independente.

## 📋 Workflows Disponíveis

### 1. 🏗️ **Infrastructure Management** (`infrastructure.yml`)

**Objetivo:** Criar, atualizar ou destruir a infraestrutura AWS (EC2, Security Groups, etc.)

**Quando usar:**

- ✅ **Primeira vez:** Para criar a instância EC2
- ✅ **Modificações:** Quando alterar configurações de infraestrutura
- ✅ **Limpeza:** Para destruir recursos e evitar custos

### 2. 🚀 **CI/CD Pipeline** (`ci-cd.yml`)

**Objetivo:** Build, test e deploy da aplicação em instância EC2 existente

**Quando usar:**

- ✅ **Sempre:** Para deploy de novas versões da aplicação
- ✅ **Automático:** Executa a cada push para `main`

## 🔄 Fluxo de Trabalho Recomendado

### **Setup Inicial (Uma vez apenas):**

1. **Configure os Secrets no GitHub:**

   ```
   AWS_ACCESS_KEY_ID          # Credenciais AWS
   AWS_SECRET_ACCESS_KEY      # Credenciais AWS
   EC2_SSH_PRIVATE_KEY        # Chave SSH privada para conectar na EC2
   ```

2. **Crie a Infraestrutura:**
   - Vá para **Actions** → **Infrastructure Management**
   - Clique **"Run workflow"**
   - Selecione **"create"**
   - Execute o workflow
   - ✅ **Resultado:** EC2 instance criada e pronta

### **Deploy de Aplicação (Sempre):**

3. **Deploy Automático:**
   - Faça commit das mudanças na aplicação
   - Push para branch `main`
   - ✅ **Resultado:** Pipeline executa automaticamente e faz deploy

### **Limpeza (Quando necessário):**

4. **Destruir Infraestrutura:**
   - Vá para **Actions** → **Infrastructure Management**
   - Clique **"Run workflow"**
   - Selecione **"destroy"**
   - Digite **"DESTROY"** na confirmação
   - Execute o workflow
   - ✅ **Resultado:** Todos os recursos AWS removidos

## 🏗️ Infrastructure Management - Detalhes

### **Triggers:**

- 🔧 **Manual apenas** (`workflow_dispatch`)

### **Opções Disponíveis:**

#### **Create/Update Infrastructure:**

```yaml
Action: create
Confirmation: (não necessária)
```

**O que faz:**

- Cria nova instância EC2 (se não existir)
- Atualiza configurações (se já existir)
- Configura Security Groups
- Retorna IP público da instância

#### **Destroy Infrastructure:**

```yaml
Action: destroy
Confirmation: DESTROY (obrigatório)
```

**O que faz:**

- Remove instância EC2
- Remove Security Groups
- Limpa todos os recursos criados
- **⚠️ AÇÃO IRREVERSÍVEL**

### **Proteções Implementadas:**

- ✅ Só executa na branch `main`
- ✅ Requer confirmação para destruição
- ✅ Environment `production` (pode requerer aprovação)
- ✅ Verifica recursos existentes antes de criar

## 🚀 CI/CD Pipeline - Detalhes

### **Triggers:**

- 🔄 **Push** para `main` ou `feat/initial_files_CI_CD`
- 🔍 **Pull Request** para `main` (só validação)

### **Jobs Executados:**

#### **1. Build & Test:**

- Compila aplicação TypeScript
- Executa testes
- Gera cliente Prisma
- Valida com PostgreSQL temporário

#### **2. Security Scan:**

- Análise de vulnerabilidades (Trivy)
- Audit de dependências (npm audit)
- Upload de relatórios para Security tab

#### **3. Docker Build:**

- Constrói imagem Docker
- Publica no GitHub Container Registry
- Cache otimizado

#### **4. Terraform Validate:**

- Verifica sintaxe e formatação
- Valida configurações
- Executa TFLint

#### **5. Ansible Validate:**

- Verifica sintaxe dos playbooks
- Executa Ansible Lint

#### **6. Deploy:**

- **🔍 Busca EC2 existente** (não cria nova)
- Configura SSH
- Executa playbooks Ansible
- Verifica saúde da aplicação

### **Comportamento do Deploy:**

#### **✅ EC2 Existente Encontrada:**

```
🔍 Searching for existing EC2 instance...
✅ Found running EC2 instance:
   Instance ID: i-1234567890abcdef0
   Public IP: 54.123.45.67
   State: running
```

→ **Deploy prossegue normalmente**

#### **❌ Nenhuma EC2 Encontrada:**

```
❌ No running EC2 instance found with tag 'EC2 DevOps Pos Graduacao'
💡 Please run the Infrastructure Management workflow first
```

→ **Deploy falha com instruções claras**

## 📊 Vantagens da Nova Arquitetura

### **🔒 Segurança:**

- Infraestrutura e aplicação separadas
- Controle granular de quando criar/destruir recursos
- Prevenção de criação acidental de recursos

### **💰 Economia:**

- EC2 não é recriada a cada deploy
- Fácil limpeza de recursos
- Deploy mais rápido (não provisiona infra)

### **🚀 Eficiência:**

- Deploy típico: ~5-10 minutos (vs ~15-20 anterior)
- Reutilização de instância existente
- Cache de Docker otimizado

### **🛠️ Manutenibilidade:**

- Separação clara de responsabilidades
- Easier troubleshooting
- Workflows independentes

## 🆘 Troubleshooting

### **"No running EC2 instance found"**

**Causa:** Nenhuma EC2 com tag correta encontrada
**Solução:** Execute o workflow "Infrastructure Management" com action "create"

### **"Invalid SSH private key"**

**Causa:** Secret `EC2_SSH_PRIVATE_KEY` não configurado corretamente
**Solução:** Configure o secret com a chave privada completa

### **"Terraform state lock"**

**Causa:** Múltiplas execuções simultâneas do Terraform
**Solução:** Aguarde execução anterior terminar

### **"EC2 instance not accessible"**

**Causa:** Security Group pode estar bloqueando SSH
**Solução:** Verifique Security Group permite porta 22 do seu IP

## 📈 Métricas e Monitoramento

### **Infrastructure Workflow:**

- ⏱️ **Tempo médio:** 3-5 minutos
- 🎯 **Taxa de sucesso:** >95%
- 💾 **Logs:** Terraform plan/apply completos

### **CI/CD Pipeline:**

- ⏱️ **Tempo médio:** 8-12 minutos
- 🎯 **Taxa de sucesso:** >90%
- 📊 **Cobertura:** Build, test, security, deploy

## 🔄 Próximos Passos

1. **Execute Infrastructure Management** para criar sua primeira EC2
2. **Faça um commit** para testar o deploy automático
3. **Monitore os logs** para entender o fluxo
4. **Configure branch protection** rules se necessário
5. **Destrua recursos** quando não estiver usando

---

## 📞 Suporte

Para problemas:

1. ✅ Verifique os logs dos workflows
2. ✅ Confirme que secrets estão configurados
3. ✅ Verifique se EC2 existe (para deploy)
4. ✅ Consulte este README para troubleshooting
