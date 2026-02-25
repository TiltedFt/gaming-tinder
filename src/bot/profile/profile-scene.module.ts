import { Module } from '@nestjs/common';
import { ProfileSceneService } from './profile-scene.service';
import { ProfileCardComponent } from './components/profile-card.component';
import { ProfileKeyboardComponent } from './components/profile-keyboard.component';
import { UserModule } from 'src/user/user.module';
import { ProfileGenderKeyboard } from './components/profile-gender-keyboard.component';

@Module({
  providers: [
    ProfileSceneService,
    ProfileCardComponent,
    ProfileKeyboardComponent,
    ProfileGenderKeyboard,
  ],
  imports: [UserModule],
})
export class ProfileSceneModule {}
