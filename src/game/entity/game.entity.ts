import { CustomBaseEntity } from 'src/common/base/base-entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Game extends CustomBaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @ManyToMany(() => User, (user) => user.games)
  users: User[];

  @Column({ type: 'varchar', nullable: true })
  coverUrl: string | null;

  @Column({ type: 'integer', unique: true })
  rawgId: number;
}
