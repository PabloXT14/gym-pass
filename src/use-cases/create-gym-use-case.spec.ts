import { GymsRepository } from '@/repositories/gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym-use-case'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: GymsRepository
let createGymUseCase: CreateGymUseCase
const fakeGymLatitude = -27.0747279
const fakeGymLongitude = -49.4889672

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: fakeGymLatitude,
      longitude: fakeGymLongitude,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
