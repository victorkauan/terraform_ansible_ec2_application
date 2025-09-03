const { faker } = require('@faker-js/faker')

// Comando para gerar string aleatória
Cypress.Commands.add('randomString', (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
})

// Comando para criar evento com title aleatório
Cypress.Commands.add('createEvent', () => {
  const randomTitle = `Devops ${Cypress._.random(1000, 9999)}-${Cypress._.random(1000, 9999)}`
  const body = {
    title: randomTitle,
    details: 'Disciplina de Devops 3',
    maximunAttendees: 5
  }
  return cy.request({
    method: 'POST',
    url: '/events',
    body,
    failOnStatusCode: false
  })
})

// Comando para registrar atendente com email aleatório
Cypress.Commands.add('registerAttendee', (eventId, attendeeData = null) => {
  const body = attendeeData || {
    name: faker.name.fullName(),
    email: faker.internet.email()
  }
  return cy.request({
    method: 'POST',
    url: `/events/${eventId}/attendees`,
    body,
    failOnStatusCode: false
  })
})

// Comando para pegar badge de um attendee
Cypress.Commands.add('getAttendeeBadge', (attendeeId) => {
  return cy.request({
    method: 'GET',
    url: `/attendees/${attendeeId}/badge`,
    failOnStatusCode: false
  })
})

// Comando para buscar evento pelo eventId
Cypress.Commands.add('getEvent', (eventId) => {
  return cy.request({
    method: 'GET',
    url: `/events/${eventId}`,
    failOnStatusCode: false
  })
})
