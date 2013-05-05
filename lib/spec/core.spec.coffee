Org = require '../src/core'

describe 'Org Config', ->
  it 'should accept the headline TODO configuration', ->
    org = new Org { headlineTodos: ['WORK'] }
    headline = '* WORK [#C] Some work to do :work:'
    parser = org.parse.headline
    result = parser(headline)
    expect(result.todo).toEqual('WORK')

  it 'should accept the headline PRIORITIES configuration', ->
    org = new Org { headlinePriorities: ['D'] }
    headline = '* TODO [#D] Some work to do :work:'
    parser = org.parse.headline
    result = parser(headline)
    expect(result.priority).toEqual('D')