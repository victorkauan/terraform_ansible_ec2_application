#!/bin/bash

echo "🚀 Iniciando sistema de monitoramento local..."

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker compose -f docker-compose.local.yml down

# Construir e iniciar containers
echo "🔨 Construindo e iniciando containers..."
docker compose -f docker-compose.local.yml up -d --build

# Aguardar serviços ficarem prontos
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 30

# Verificar status dos containers
echo "📊 Status dos containers:"
docker compose -f docker-compose.local.yml ps

# Testar endpoints
echo "🧪 Testando endpoints..."

# Testar API
echo "Testing API..."
curl -s http://localhost:2424/docs > /dev/null && echo "✅ API está funcionando" || echo "❌ API não está funcionando"

# Testar Prometheus
echo "Testing Prometheus..."
curl -s http://localhost:9090/-/healthy > /dev/null && echo "✅ Prometheus está funcionando" || echo "❌ Prometheus não está funcionando"

# Testar Grafana
echo "Testing Grafana..."
curl -s http://localhost:3000/api/health > /dev/null && echo "✅ Grafana está funcionando" || echo "❌ Grafana não está funcionando"

# Testar métricas
echo "Testing Metrics..."
curl -s http://localhost:2424/metrics > /dev/null && echo "✅ Métricas estão funcionando" || echo "❌ Métricas não estão funcionando"

echo ""
echo "🎉 Sistema de monitoramento iniciado!"
echo ""
echo "📊 URLs disponíveis:"
echo "  - API: http://localhost:2424/docs"
echo "  - Prometheus: http://localhost:9090"
echo "  - Grafana: http://localhost:3000 (admin/admin123)"
echo "  - Alertmanager: http://localhost:9093"
echo "  - Node Exporter: http://localhost:9100"
echo ""
echo "🧪 Para gerar carga de teste:"
echo "  npm run generate-load"
echo ""
echo "🛑 Para parar:"
echo "  docker compose -f docker-compose.local.yml down"
