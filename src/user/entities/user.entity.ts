import { CustomBaseEntity } from 'src/common/base/base-entity';
import { Language } from 'src/common/constants/supported-language';
import { Game } from 'src/game/entity/game.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity()
export class User extends CustomBaseEntity {
  @Column({ type: 'integer', unique: true })
  telegramId: number;

  // custom users username - for public
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  publicUsername: string | null;

  // telegram username
  @Column({ type: 'varchar', length: 32, nullable: true })
  telegramUsername: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false })
  hasMic: boolean;

  @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column({ type: 'smallint', nullable: true })
  age: number | null;

  @Column({ type: 'text', nullable: true })
  preferredCommunicationWay: string | null;

  @ManyToMany(() => Game, (game) => game.users)
  @JoinTable()
  games: Game[];

  @Column({ type: 'enum', enum: Language })
  botLanguage: Language;

  @Column({ type: 'varchar', nullable: true })
  avatarFileId: string | null;

  /*   // in da future goes into redddiiiiiis
  @Column({type: 'boolean', default: false})
  isActivelySearching: boolean; */
}
