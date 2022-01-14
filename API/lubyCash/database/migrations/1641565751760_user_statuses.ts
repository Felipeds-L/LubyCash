import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserStatuses extends BaseSchema {
  protected tableName = 'user_statuses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onDelete('CASCADE')
      table
        .integer('status_id')
        .unsigned()
        .references('statuses.id')
        .onDelete('CASCADE')
        .defaultTo(2)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
