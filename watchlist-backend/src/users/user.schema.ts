import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
// import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: string;

  @Prop({ default: '' })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  tokenV3: string;

  @Prop()
  tokenV4: string;

  @Prop()
  account_id: string;

  @Prop()
  request_token: string;

  comparePassword: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  // const password = user.password;
  bcrypt.genSalt(10, (err: Error, salt: string) => {
    if (err) {
      return next();
    }

    bcrypt.hash(user.password, salt, (err: Error, hash: string) => {
      if (err) {
        return next();
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword: string) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(
      candidatePassword,
      user.password,
      (err: Error, isMatch: boolean) => {
        if (err) {
          return reject(err);
        }
        if (!isMatch) {
          return resolve(false);
        }
        resolve(true);
      },
    );
  });
};
