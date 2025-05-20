variable "instance_type" {
  description = "Tipo da instância EC2"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Nome do key pair já criado na AWS (usado para SSH)"
  type        = string
  default     = "meu-key-pessoal"
}