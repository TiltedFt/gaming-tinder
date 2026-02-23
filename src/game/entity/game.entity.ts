import { CustomBaseEntity } from 'src/common/base-entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class GamingPlatform extends CustomBaseEntity {
  @Column({ type: 'varchar' })
  name: string; //ex PS5, PS4 and so on

  @ManyToMany(() => Game, (game) => game.platforms)
  games: Game[];
}

@Entity()
export class Game extends CustomBaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @ManyToMany(() => User, (user) => user.games)
  users: User[];

  @ManyToMany(() => GamingPlatform, (platform) => platform.games)
  @JoinTable()
  platforms: GamingPlatform[];
}
