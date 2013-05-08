require 'jasmine-matchers'

Config = require '../src/config'

describe 'Config', ->
  it 'should be defined', ->
    expect(Config).toBeDefined()
    expect(Config).not.toBeNull()

describe 'Config.prepare', ->
  it 'should define correct values', ->
    init = 
      tabSize: 2
      headlineTodos: ['TODO', 'DONE', 'WAIT']

    obj = Config.prepare(init)
    expect(obj).toBeDefined()
    expect(obj).not.toBeNull()
    expect(obj.tabSize).toBe(init.tabSize)
    expect(obj.headlineTodos).toBe(init.headlineTodos)
    expect(obj.headlinePriorities).toBe(Config.defaults.headlinePriorities)

    expect(obj.get).toBeOfType('function')
    expect(obj.get('tabSize')).toBe(init.tabSize)
