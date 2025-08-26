const { faker } = require('@faker-js/faker')
describe('Events and Attendees API', () => {
  let eventId
  let attendeeId

  it('Criando um evento', () => {
    cy.createEvent().then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('eventId')
      eventId = res.body.eventId
    })
  })

  it('Buscar Evento Criado', () => {
    cy.getEvent(eventId).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.event).to.have.property('title')
      expect(res.body.event).to.have.property('details', 'Disciplina de Devops 3')
      expect(res.body.event).to.have.property('maximunAttendees', 5)
    })
  })


it('Registrando Participante', () => {
  // Gerando nome e email aleatórios
  const randomName = faker.name.fullName()
  const randomEmail = faker.internet.email()

  // Registrando o participante
  cy.registerAttendee(eventId, { name: randomName, email: randomEmail }).then((res) => {
    expect(res.status).to.eq(201)
    expect(res.body).to.have.property('attendeeId')
    
    // Salva os dados para usar nos próximos testes
    attendeeId = res.body.attendeeId
    cy.wrap(randomName).as('attendeeName')
    cy.wrap(randomEmail).as('attendeeEmail')
  })
})

it('Buscando credencial do participante', function () {
  // Usa o attendeeId e os dados gerados no teste anterior
  cy.getAttendeeBadge(attendeeId).then((resBadge) => {
    expect(resBadge.status).to.eq(200)
    expect(resBadge.body.attendee).to.have.property('name', this.attendeeName)
    expect(resBadge.body.attendee.email).to.eq(this.attendeeEmail)
    expect(resBadge.body.attendee.event).to.have.property('title')
  })
})

  it('Buscando credencial de um participante que não existe', () => {
    cy.getAttendeeBadge(999999).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('message', 'Inscrição não encontrada')
    })
  })
   it('Buscar detalhes do evento pelo eventId', () => {
    cy.request({
      method: 'GET',
      url: `/events/${eventId}`, // usando o eventId da requisição anterior
      failOnStatusCode: false,
    }).then((res) => {
      // Validações
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('event');
      expect(res.body.event).to.have.property('title').and.to.be.a('string');
      expect(res.body.event).to.have.property('details', 'Disciplina de Devops 3');
      expect(res.body.event).to.have.property('maximunAttendees', 5);
      expect(res.body.event).to.have.property('attendeesAmount').and.to.be.a('number');
    });
  });

  it('Tenta buscar evento inexistente', () => {
    cy.request({
      method: 'GET',
      url: `/events/00000000-0000-0000-0000-000000000000`, // UUID inválido
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(409);
      expect(res.body).to.have.property('message', 'Evento não encontrado');
    });
  });
});

