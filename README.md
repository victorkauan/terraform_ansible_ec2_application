# terraform_ansible_ec2_application

Este projeto demonstra a prática de DevOps utilizando Terraform, Ansible e Docker para provisionar e configurar uma aplicação em uma instância EC2 na AWS. Ele foi desenvolvido como parte da Pós-graduação em Engenharia de Software com DevOps - UNIFOR.

## Tecnologias Utilizadas

- **Terraform**: Para provisionar a infraestrutura na AWS, incluindo a criação de uma instância EC2.
- **Ansible**: Para configurar a instância EC2 e implantar a aplicação Docker.
- **Docker**: Para containerizar a aplicação.
- **Prisma**: ORM utilizado na aplicação para gerenciar o banco de dados SQLite.

## Arquitetura

![Arquitetura do projeto](./Diagrama-arquitetura.svg)

## Estrutura do Projeto

- **ansible/**: Contém os arquivos de configuração e playbooks do Ansible.
  - `playbook.yml`: Playbook principal para configurar a instância EC2.
  - `docker-compose-server.yml`: Arquivo Docker Compose para gerenciar os containers.
- **server/**: Código-fonte da aplicação.
  - `src/`: Contém os arquivos principais da aplicação, incluindo rotas e utilitários.
  - `prisma/`: Configuração do banco de dados e migrações.
- **terraform/**: Arquivos de configuração do Terraform para provisionar a infraestrutura.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- Terraform
- Ansible
- Docker
- AWS CLI configurado com credenciais válidas

## Como Executar

1. **Provisionar a Infraestrutura**

   - Navegue até o diretório `terraform/`.
   - Execute os comandos:

     ```bash
     terraform init
     terraform apply
     ```

   - Confirme a criação da infraestrutura.

2. **Configurar a Instância EC2**

   - Navegue até o diretório `ansible/`.
   - Execute o playbook:

     ```bash
     ansible-playbook -i inventory.yml playbook.yml
     ```

3. **Acessar a Aplicação**
   - Após a execução bem-sucedida, a aplicação estará disponível no endereço público da instância EC2. Exemplo: `132.45.125.50:2424/docs`
