import { UserRepository } from '../repositories/userRepository.ts';
import { AppError, UnauthorizedError } from '../utils/http.ts';
import { hashPassword, verifyPassword } from '../utils/password.ts';
import { signToken } from '../utils/token.ts';
import type { LoginBody, RegisterBody } from '../schemas/authSchema.ts';

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  // Register publik: role SELALU 'customer'. Role tidak pernah dibaca dari body.
  async register(input: RegisterBody) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, 'Email sudah terdaftar');

    const row = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash: hashPassword(input.password),
      role: 'customer',
    });
    if (!row) throw new AppError(500, 'Gagal membuat akun');

    return { id: row.id, name: row.name, email: row.email, role: row.role };
  }

  async login(input: LoginBody) {
    const user = await this.userRepository.findAuthByEmail(input.email);

    // Pesan sengaja sama untuk email salah dan password salah.
    if (!user || !verifyPassword(input.password, user.passwordHash)) {
      throw new UnauthorizedError('Email atau password salah');
    }

    const token = signToken({ id: user.id, role: user.role });
    return {
      token,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async me(userId: number) {
    const row = await this.userRepository.findById(userId);
    if (!row) throw new UnauthorizedError('Akun tidak ditemukan');
    return { id: row.id, name: row.name, email: row.email, role: row.role };
  }
}