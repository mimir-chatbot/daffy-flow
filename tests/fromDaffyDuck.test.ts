import { fromDaffyDuck } from '@daffy'
import { expect, it } from 'vitest'

it('fromDaffyDuckEmpty', () => {
  expect(fromDaffyDuck({ nodes: [], edges: [] })).toEqual({
    nodes: [],
    edges: [],
  })
})
