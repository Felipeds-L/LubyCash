# LubyCash
Requisitos Não Funcionais:

RNF01 – O Backend deve ser implementado utilizando o AdonisJS. - Feito (em desenvolvimento);

RNF02 – O Microsserviço deve ser implementado em ExpressJS - Feito (em desenvolvimento);

RNF03 – Para fazer a comunicação entre o MS e o Backend Principal, deve ser utilizado o Kafka. Feito;

RNF04 – Obrigatório a utilização do Docker. - Feito/Parcialmente

Requisitos Funcionais:

RF01 – Crud de Admins: Apenas administradores poderão cadastrar outros.

RF02 – Listagem de todos os clientes por status: Apenas para administradores.

Observações: O usuário poderá filtrar por status e por data do status.

RF03 – Extrato do cliente: Apenas para administradores.

Observações: O usuário poderá filtrar por intervalo de datas.

RF04 – Cadastro de novos clientes: Os usuários terão uma rota pública onde vão mandar os dados para ser cliente do banco, todos os dados passarão por uma esteira de aprovação automática. Para isso, vamos criar um microsserviço avaliar os novos clientes. (Admins não poderão aprovar manualmente um cliente). - Feito

Sobre o MS: Será em Express e utilizaremos o serviço de mensageria Kafka para receber os dados dos novos clientes. A tabela de clientes ficará no microsserviço e poderá ser consultado através de API REST (Sem autenticação). - Feito parcialmente - falta consulta pela API

Regras para Avaliação: Renda Mensal < 500 = Reprovado || Renda Mensal >= 500 = Aprovado. Todo cliente aprovado ganhará R$ 200,00 de boas vindas. - Feito

Observações: O microsserviço deverá mandar um e-mail informando o cliente sobre o status da solicitação. Um CPF reprovado, não poderá enviar nova solicitação.

RF05 – Pix: Os clientes aprovados poderão fazer um PIX para outros clientes do banco utilizando o CPF.

RF06 – Login de acesso para admins/clientes e recuperar senha.
