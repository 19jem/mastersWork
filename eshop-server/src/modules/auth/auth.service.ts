import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private users: UsersService, private jwt: JwtService) {}

    async register(name: string, email: string, password: string) {
        const exists = (await this.users.findAll()).find(u => u.email === email);
        if(exists) throw new ConflictException('Email already exists');

        const hashed = await bcrypt.hash(password, 10);
        return this.users.create({name, email, password: hashed});
    }

    async login(email:string, password: string){
        const user = (await this.users.findAll()).find(u => u.email === email); //тут потім краще зробити пошук за емейлом а не зав всім, але поки так
        if(!user) throw new UnauthorizedException('Invalid email or password');

        const valid = await bcrypt.compare(password, user.password ?? '');
        if(!valid) throw new UnauthorizedException('Invalid email or password');

        const payload = {sub: user._id, email: user.email};
        const token = await this.jwt.signAsync(payload);

        return {access_token: token};
    }
}
