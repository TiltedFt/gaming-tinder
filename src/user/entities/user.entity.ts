import { CustomBaseEntity } from "src/common/base-entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends CustomBaseEntity {
  @Column({type: 'varchar', length: 20})
  userId: string;

  // custom users username - for public
  @Column({type:'varchar', length: 50})
  publickUsername: string;

  // telegram username
  @Column({type: 'varchar', length: 32 })
  username: string;

  @Column({type: "text"})
  description: string;

  @Column({type: 'boolean'})
  hasMic: boolean;

  @Column({type: 'varchar'})
  gender: string;

  @Column({type: 'smallint'})
  age: number;

  // in da future goes into redddiiiiiis
  @Column({type: 'boolean', default: false})
  isActivelySearching: boolean
}
