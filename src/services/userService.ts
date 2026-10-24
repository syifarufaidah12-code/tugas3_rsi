import { UserRepository, type FindUsersParams } from '../repositories/userRepository.ts';
import type { CreateUserInput, UserResponseDto } from '../dtos/userDto.ts';
import { AppError } from '../utils/http.ts';
import { hashPassword } from '../utils/password.ts';

type UserRow = NonNullable<Awaited<ReturnType<UserRepository['findById']>>>;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  private toDto(row: UserRow): UserResponseDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt,
    };
  }

  async getAllUsers(params: FindUsersParams) {
    const { rows, total } = await this.userRepository.findAll(params);
    return { data: rows.map((row) => this.toDto(row)), total };
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const row = await this.userRepository.findById(id);
    if (!row) throw new AppError(404, 'Data user tidak ditemukan');
    return this.toDto(row);
  }

  async createUser(input: CreateUserInput): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, 'Email sudah terdaftar');

    const row = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash: hashPassword(input.password),
      role: input.role,
    });
    if (!row) throw new AppError(500, 'Gagal membuat user');
    return this.toDto(row);
  }
}
