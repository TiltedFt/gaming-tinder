import { CustomBaseEntity } from 'src/common/base/base-entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity()
export class Language extends CustomBaseEntity {
  // iso 639-1 code: "en", "ru" and so on
  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @ManyToMany(() => User, (user) => user.spokenLanguages)
  users: User[];

  // true = bots UI supports the language
  // false = its only for user to Display
  @Column({ type: 'boolean', default: false })
  isBotSupported: boolean;

  @Column({ type: 'varchar', length: 50 })
  nativeName: string;
}
