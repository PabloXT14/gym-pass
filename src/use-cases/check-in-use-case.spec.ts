import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in-use-case'
import { afterEach } from 'node:test'

let checkInsRepository: InMemoryCheckInsRepository
let checkInUseCase: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers() // para o mocking de datas do vitest não afetar outros testes do suite
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0)) // 2022-01-20 08:00:00

    await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    await expect(() =>
      checkInUseCase.execute({
        userId: 'user-01',
        gymId: 'gym-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0)) // 2022-01-20 08:00:00

    await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0)) // 2022-01-21 08:00:00

    const { checkIn } = await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
