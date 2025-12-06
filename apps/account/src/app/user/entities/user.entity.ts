import { IUser, IUserViewModel } from '@mono-calendar/interface';
import { AccountRegister } from '@mono-calendar/contracts';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  id: string;
  email: string;
  isEmailVerified: boolean;
  passwordHash: string;
  avatarUrl: string | null;
  name: string;

  static async createFromDto(user: AccountRegister.Request): Promise<UserEntity> {
    const userEntity = new UserEntity({
      id: crypto.randomUUID(),
      email: user.email,
      isEmailVerified: false,
      passwordHash: '1',
      avatarUrl: null,
      name: 'Искатель',
    });
    await userEntity.setPassword(user.password);
    return userEntity;
  }

  constructor(user: IUser) {
    this.id = user.id;

    this.email = user.email;
    this.isEmailVerified = user.isEmailVerified;
    this.passwordHash = user.passwordHash;
    this.avatarUrl = user.avatarUrl;
    this.name = user.name;
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async isCorrectPassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  public updateProfile(fields: Partial<IUser>): UserEntity {
    this.name = fields.name ?? this.name;
    return this;
  }

  public getPublicProfile(): IUserViewModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatarUrl: this.avatarUrl,
    };
  }
}
