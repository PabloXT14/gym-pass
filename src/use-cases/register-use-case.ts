import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userExists) {
      throw new Error('Email already exists.')
    }

    const password_hash = await hash(password, 6)

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
