import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        full_name: 'felipe da silva leite',
        email: 'felipe@leite.com',
        phone: '98329-3291',
        cpf_number: '332244023934',
        address: 'rua nova, nº 77',
        city: 'limoeiro de anadia',
        state: 'AL',
        zipcode: '57260-000',
        average_salary: 2200
      },
      {
        full_name: 'victor daniel vieira santos',
        email: 'victor@daniel.com',
        phone: '98633-3291',
        cpf_number: '11244235312',
        address: 'boa vista, nº 314',
        city: 'arapiraca',
        state: 'AL',
        zipcode: '57390-305',
        average_salary: 1950
      },
      {
        full_name: 'matheus henrique vieira santos',
        email: 'matheus@henrique.com',
        phone: '95766-3291',
        cpf_number: '123456789',
        address: 'boa vista, nº 314',
        city: 'arapiraca',
        state: 'AL',
        zipcode: '57390-305',
        average_salary: 1600
      },
      {
        full_name: 'ruan victor barros nunes',
        email: 'ruan@victor.com',
        phone: '98732-3291',
        cpf_number: '9787391224',
        address: 'rua tiradentes, nº 116',
        city: 'arapiraca',
        state: 'AL',
        zipcode: '57305-340',
        average_salary: 7600
      },
    ])
  }
}
