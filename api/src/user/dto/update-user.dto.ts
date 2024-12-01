import { 
  IsString, 
  IsOptional, 
  IsEmail, 
  MinLength, 
  MaxLength, 
  Matches 
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  name?: string;

  @IsEmail({}, { message: 'Formato inválido de email' })
  @IsOptional()
  @MaxLength(100, { message: 'Email não pode ter mais de 100 caracteres' })
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 digitos' })
  @MaxLength(20, { message: 'Senha deve ter no máximo 20 dígitos' })
  @Matches(/[A-Z]/, { message: 'Senha deve ter pelo menos uma letra maiúscula' })
  @Matches(/[a-z]/, { message: 'Senha deve ter pelo menos uma letra minúscula' })
  @Matches(/\d/, { message: 'Senha deve ter pelo menos um número' })
  @Matches(/[\W_]/, { message: 'Senha deve ter pelo menos um caracter especial' })
  password?: string;
}
