import { prisma } from "@/lib/prisma"
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository"
import { hash } from "bcryptjs"

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({ name, email, password }: RegisterUseCaseRequest) {
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    }
  })

  if (userExists) {
    throw new Error('Email already exists.')
  }

  const password_hash = await hash(password, 6)

  const prismaUsersRepository = new PrismaUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}