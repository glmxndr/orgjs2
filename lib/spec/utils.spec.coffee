_U = require '../src/utils.js'

describe 'Utils is imported', ->
  it 'should be defined', ->
    expect(_U).toBeDefined()
    expect(_U).not.toBeNull()

describe 'Utils contains a hello world.', ->
  it 'should contain a hello world keyval', ->
    expect(_U.hello).toBeDefined()
    expect(_U.hello).toBe('world')

