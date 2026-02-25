import { CustomBaseEntity } from 'src/common/base/base-entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Game extends CustomBaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @ManyToMany(() => User, (user) => user.games)
  users: User[];
}
