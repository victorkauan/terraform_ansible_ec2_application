#!/usr/bin/env node

const axios = require("axios")

const BASE_URL = process.env.API_URL || "http://localhost:2424"

async function createEvent(title, details, maxAttendees) {
  try {
    const response = await axios.post(`${BASE_URL}/events`, {
      title,
      details,
      maximunAttendees: maxAttendees,
    })
    return response.data.eventId
  } catch (error) {
    console.error(
      "Erro ao criar evento:",
      error.response?.data || error.message
    )
    return null
  }
}

async function registerAttendee(eventId, name, email) {
  try {
    const response = await axios.post(
      `${BASE_URL}/events/${eventId}/attendees`,
      {
        name,
        email,
      }
    )
    return response.data.attendeeId
  } catch (error) {
    console.error(
      "Erro ao registrar participante:",
      error.response?.data || error.message
    )
    return null
  }
}

async function getEvent(eventId) {
  try {
    const response = await axios.get(`${BASE_URL}/events/${eventId}`)
    return response.data
  } catch (error) {
    console.error(
      "Erro ao buscar evento:",
      error.response?.data || error.message
    )
    return null
  }
}

async function generateLoad() {
  console.log("🚀 Gerando carga de teste para as métricas...\n")

  // Criar alguns eventos
  const events = []
  for (let i = 1; i <= 5; i++) {
    const eventId = await createEvent(
      `Evento de Teste ${i}`,
      `Descrição do evento de teste ${i}`,
      100
    )
    if (eventId) {
      events.push(eventId)
      console.log(`✅ Evento criado: ${eventId}`)
    }
  }

  // Registrar participantes nos eventos
  for (const eventId of events) {
    for (let i = 1; i <= 10; i++) {
      const attendeeId = await registerAttendee(
        eventId,
        `Participante ${i}`,
        `participante${i}@teste.com`
      )
      if (attendeeId) {
        console.log(
          `✅ Participante registrado: ${attendeeId} no evento ${eventId}`
        )
      }
    }
  }

  // Fazer algumas consultas
  for (const eventId of events) {
    await getEvent(eventId)
    console.log(`✅ Evento consultado: ${eventId}`)
  }

  console.log("\n🎉 Carga de teste gerada com sucesso!")
  console.log("📊 Verifique as métricas em:")
  console.log(`   - Prometheus: ${BASE_URL.replace("2424", "9090")}`)
  console.log(`   - Grafana: ${BASE_URL.replace("2424", "3000")}`)
}

// Executar se chamado diretamente
if (require.main === module) {
  generateLoad().catch(console.error)
}

module.exports = { generateLoad, createEvent, registerAttendee, getEvent }
