Org = require('../src/core.js');

describe 'Org Config', ->
  it 'should accept the heading TODO configuration', ->
    org = new Org { headingTodos: ['WORK'] }
    heading = '* WORK [#C] Some work to do :work:'
    parser = org.parse.heading
    result = parser(heading)
    expect(result.todo).toEqual('WORK')

  it 'should accept the heading PRIORITIES configuration', ->
    org = new Org { headingPriorities: ['D'] }
    heading = '* TODO [#D] Some work to do :work:'
    parser = org.parse.heading
    result = parser(heading)
    expect(result.priority).toEqual('D')