# 📊 Sistema de Monitoramento - Events API

Este projeto agora inclui um sistema completo de monitoramento com **Prometheus**, **Grafana** e **Alertmanager** para monitorar a aplicação de eventos em tempo real.

## 🚀 **Componentes do Sistema**

### **1. Prometheus**

- **Função**: Coleta e armazena métricas
- **Porta**: 9090
- **URL**: `http://seu-ip:9090`

### **2. Grafana**

- **Função**: Visualização e dashboards
- **Porta**: 3000
- **URL**: `http://seu-ip:3000`
- **Credenciais**: `admin/admin123`

### **3. Alertmanager**

- **Função**: Gerenciamento de alertas
- **Porta**: 9093
- **URL**: `http://seu-ip:9093`

### **4. Node Exporter**

- **Função**: Métricas do sistema
- **Porta**: 9100
- **URL**: `http://seu-ip:9100`

## 📈 **Métricas Coletadas**

### **Métricas HTTP**

- `http_requests_total` - Total de requisições por endpoint
- `http_request_duration_seconds` - Tempo de resposta das requisições
- `http_requests_total{status_code=~"5.."}` - Taxa de erro 5xx
- `http_requests_total{status_code=~"4.."}` - Taxa de erro 4xx

### **Métricas de Negócio**

- `events_created_total` - Total de eventos criados
- `events_active` - Número atual de eventos ativos
- `attendees_registered_total` - Total de participantes registrados
- `attendees_active` - Número atual de participantes ativos

### **Métricas de Erro**

- `errors_total` - Total de erros por tipo
- `errors_total{error_type="duplicate_slug"}` - Erros de slug duplicado
- `errors_total{error_type="event_not_found"}` - Eventos não encontrados
- `errors_total{error_type="event_full"}` - Eventos lotados

### **Métricas de Sistema**

- `up{job="events-api"}` - Status da aplicação
- `node_cpu_seconds_total` - Uso de CPU
- `node_memory_MemAvailable_bytes` - Memória disponível
- `node_filesystem_avail_bytes` - Espaço em disco

## 🚨 **Alertas Configurados**

### **Alertas Críticos**

1. **ApplicationDown** - Aplicação fora do ar
2. **HighErrorRate** - Alta taxa de erro (>10% em 5min)
3. **DatabaseErrors** - Erros de banco de dados

### **Alertas de Aviso**

1. **HighLatency** - Latência alta (>2s no 95º percentil)
2. **HighRequestRate** - Muitas requisições (>100/seg)
3. **HighDatabaseConnections** - Muitas conexões de banco (>80)
4. **SlowDatabaseQueries** - Queries lentas (>1s no 95º percentil)

### **Alertas Informativos**

1. **EventNearCapacity** - Evento próximo da capacidade (>80%)

## 📊 **Dashboards Disponíveis**

### **Events API Dashboard**

- **Métricas de Performance**: Taxa de requisições, tempo de resposta
- **Métricas de Negócio**: Eventos criados, participantes registrados
- **Métricas de Erro**: Tipos de erro, taxas de erro
- **Status do Sistema**: Status da aplicação, conexões de banco

## 🛠️ **Como Usar**

### **1. Acessar o Grafana**

```bash
# URL: http://seu-ip:3000
# Usuário: admin
# Senha: admin123
```

### **2. Importar Dashboard**

1. Acesse o Grafana
2. Vá em **Dashboards** → **Import**
3. Cole o conteúdo do arquivo `grafana/dashboards/events-api-dashboard.json`
4. Clique em **Load**

### **3. Verificar Alertas**

```bash
# Acesse o Alertmanager
http://seu-ip:9093

# Verifique alertas ativos
http://seu-ip:9090/alerts
```

### **4. Gerar Carga de Teste**

```bash
# Execute o script de geração de carga
npm run generate-load

# Ou com URL customizada
API_URL=http://seu-ip:2424 npm run generate-load
```

## 🔧 **Configuração Avançada**

### **Personalizar Alertas**

Edite o arquivo `prometheus/alert.rules` para adicionar novos alertas:

```yaml
- alert: CustomAlert
  expr: your_metric > threshold
  for: 2m
  labels:
    severity: warning
  annotations:
    summary: "Custom alert"
    description: "Description here"
```

### **Adicionar Novas Métricas**

1. Importe as métricas em `server/src/lib/metrics.ts`
2. Use-as nas rotas da aplicação
3. O Prometheus coletará automaticamente

### **Configurar Notificações**

Edite `alertmanager/alertmanager.yml` para configurar:

- Email
- Slack
- Webhooks
- PagerDuty

## 📈 **Queries Úteis do Prometheus**

### **Taxa de Requisições por Endpoint**

```promql
rate(http_requests_total[5m])
```

### **Latência 95º Percentil**

```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### **Taxa de Erro**

```promql
rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m])
```

### **Eventos por Minuto**

```promql
rate(events_created_total[5m]) * 60
```

## 🎯 **Melhores Práticas**

### **1. Monitoramento Proativo**

- Configure alertas antes de problemas
- Monitore tendências, não apenas valores absolutos
- Use SLOs (Service Level Objectives)

### **2. Dashboards Efetivos**

- Mantenha dashboards simples e focados
- Use cores consistentes (verde=ok, amarelo=warning, vermelho=critical)
- Inclua contexto nos alertas

### **3. Retenção de Dados**

- Configure retenção adequada no Prometheus
- Use backup para dados históricos importantes
- Considere usar Thanos ou Cortex para escalabilidade

## 🚀 **Próximos Passos**

1. **Configurar Notificações**: Slack, email, SMS
2. **Adicionar Métricas Customizadas**: Business KPIs
3. **Implementar SLOs**: Service Level Objectives
4. **Configurar Backup**: Retenção de dados históricos
5. **Adicionar Tracing**: Distributed tracing com Jaeger

---

**🎉 Agora você tem um sistema de monitoramento completo e profissional!**
