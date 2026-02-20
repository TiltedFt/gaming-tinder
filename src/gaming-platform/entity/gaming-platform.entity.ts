import { CustomBaseEntity } from 'src/common/base-entity';
import { Game } from 'src/game/entity/game.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class GamingPlatform extends CustomBaseEntity {
  @Column({ type: 'varchar' })
  name: string; //ex PS5, PS4 and so on

  @ManyToMany(() => Game, (game) => game.platforms)
  games: Game[];
}
