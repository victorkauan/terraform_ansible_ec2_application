# 🧪 Teste Local do Sistema de Monitoramento

Este guia mostra como testar o sistema de monitoramento localmente antes de fazer o deploy.

## 🚀 **Início Rápido**

### **1. Iniciar o Sistema**

```bash
# Iniciar todos os serviços
npm run monitoring:start

# Ou manualmente
docker compose -f docker-compose.local.yml up -d --build
```

### **2. Verificar Status**

```bash
# Ver logs dos containers
npm run monitoring:logs

# Ver status dos containers
docker compose -f docker-compose.local.yml ps
```

### **3. Acessar as Ferramentas**

- **API**: http://localhost:2424/docs
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin123)
- **Alertmanager**: http://localhost:9093
- **Node Exporter**: http://localhost:9100

## 📊 **Testando as Métricas**

### **1. Gerar Carga de Teste**

```bash
# Gerar dados de teste
npm run generate-load

# Ou com URL específica
API_URL=http://localhost:2424 npm run generate-load
```

### **2. Verificar Métricas no Prometheus**

1. Acesse http://localhost:9090
2. Vá em **Status** → **Targets**
3. Verifique se `events-api` está **UP**
4. Vá em **Graph** e teste queries:
   - `http_requests_total`
   - `events_created_total`
   - `attendees_registered_total`

### **3. Importar Dashboard no Grafana**

1. Acesse http://localhost:3000
2. Login: `admin/admin123`
3. Vá em **Dashboards** → **Import**
4. Cole o conteúdo de `../grafana/dashboards/events-api-dashboard.json`
5. Clique em **Load**

## 🔧 **Comandos Úteis**

### **Gerenciar Containers**

```bash
# Iniciar
npm run monitoring:start

# Parar
npm run monitoring:stop

# Ver logs
npm run monitoring:logs

# Rebuild
docker compose -f docker-compose.local.yml up -d --build
```

### **Testar Endpoints**

```bash
# Testar API
curl http://localhost:2424/docs

# Testar métricas
curl http://localhost:2424/metrics

# Testar Prometheus
curl http://localhost:9090/-/healthy

# Testar Grafana
curl http://localhost:3000/api/health
```

### **Limpar Dados**

```bash
# Parar e remover volumes
docker compose -f docker-compose.local.yml down -v

# Remover imagens
docker compose -f docker-compose.local.yml down --rmi all
```

## 🐛 **Solução de Problemas**

### **Problema: API não responde**

```bash
# Verificar logs da API
docker compose -f docker-compose.local.yml logs events-api-local

# Verificar se o banco está funcionando
docker compose -f docker-compose.local.yml logs db
```

### **Problema: Prometheus não coleta métricas**

```bash
# Verificar configuração
docker compose -f docker-compose.local.yml logs prometheus-local

# Verificar se a API está acessível
curl http://events-api-local:2424/metrics
```

### **Problema: Grafana não carrega**

```bash
# Verificar logs do Grafana
docker compose -f docker-compose.local.yml logs grafana-local

# Verificar se o Prometheus está acessível
curl http://prometheus-local:9090/-/healthy
```

## 📈 **Métricas Disponíveis**

### **Métricas HTTP**

- `http_requests_total` - Total de requisições
- `http_request_duration_seconds` - Tempo de resposta

### **Métricas de Negócio**

- `events_created_total` - Eventos criados
- `events_active` - Eventos ativos
- `attendees_registered_total` - Participantes registrados
- `attendees_active` - Participantes ativos

### **Métricas de Erro**

- `errors_total` - Total de erros por tipo

### **Métricas de Sistema**

- `up{job="events-api"}` - Status da aplicação
- `node_cpu_seconds_total` - CPU
- `node_memory_MemAvailable_bytes` - Memória

## 🚨 **Alertas Configurados**

### **Alertas Críticos**

- **ApplicationDown** - API fora do ar
- **HighErrorRate** - Alta taxa de erro

### **Alertas de Aviso**

- **HighLatency** - Latência alta
- **HighRequestRate** - Muitas requisições

## 🎯 **Próximos Passos**

1. **Testar Alertas**: Simule falhas para ver alertas
2. **Personalizar Dashboards**: Modifique o dashboard do Grafana
3. **Adicionar Métricas**: Implemente métricas customizadas
4. **Configurar Notificações**: Configure Slack/Email no Alertmanager

---

**🎉 Agora você pode testar todo o sistema de monitoramento localmente!**
