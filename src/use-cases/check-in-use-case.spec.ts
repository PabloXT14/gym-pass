import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in-use-case'
import { afterEach } from 'node:test'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

const fakeUserLatitude = -27.2092052
const fakeUserLongitude = -49.6401092

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(fakeUserLatitude),
      longitude: new Decimal(fakeUserLongitude),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers() // para o mocking de datas do vitest não afetar outros testes do suite
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: fakeUserLatitude,
      userLongitude: fakeUserLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0)) // 2022-01-20 08:00:00

    await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: fakeUserLatitude,
      userLongitude: fakeUserLongitude,
    })

    await expect(() =>
      checkInUseCase.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: fakeUserLatitude,
        userLongitude: fakeUserLongitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0)) // 2022-01-20 08:00:00

    await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: fakeUserLatitude,
      userLongitude: fakeUserLongitude,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0)) // 2022-01-21 08:00:00

    const { checkIn } = await checkInUseCase.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: fakeUserLatitude,
      userLongitude: fakeUserLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in too far from the gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
    })

    await expect(() =>
      checkInUseCase.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: fakeUserLatitude,
        userLongitude: fakeUserLongitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
