import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('full_name').notNullable()
      table.string('email').unique().notNullable()
      table.string('phone').unique()
      table.string('cpf_number').unique().notNullable()
      table.string('address').notNullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.string('zipcode').notNullable()
      table.string('salary_average').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
