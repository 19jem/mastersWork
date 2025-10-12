import { Controller, Body, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post('register')
    register(@Body() dto: {name: string,email: string, password: string}){
      return this.auth.register(dto.name, dto.email, dto.password);
    }

    @Post('login')
    login(@Body() dto: {email: string, password: string}){
      return this.auth.login( dto.email, dto.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    profile(@Request() req){
      return req.user;
    }

}