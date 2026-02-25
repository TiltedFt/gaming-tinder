import { Module } from '@nestjs/common';
import { ProfileSceneService } from './profile-scene.service';
import { ProfileCardComponent } from './components/profile-card.component';
import { ProfileKeyboardComponent } from './components/profile-keyboard.component';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [
    ProfileSceneService,
    ProfileCardComponent,
    ProfileKeyboardComponent,
  ],
  imports: [UserModule],
})
export class ProfileSceneModule {}
