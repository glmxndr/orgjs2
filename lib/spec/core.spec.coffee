Org = require '../src/core'

describe 'Org.parse', ->
  txt = """
  #+TITLE: Test document

  This is a test document[fn:1].

  [fn:1] It should be put in its own file. 
         But whatever.

  * Work
  ** TODO Test the footnotes
     This section should contain footnotes[fn::Even inline ones.].

     This line contains a simple reference to the first footnote[fn:1].

  ** TODO Put the test document in its own file
  """

  it 'should parse correctly', ->
    org = new Org()
    parser = org.parse.document()
    doc = parser txt
    expect(!!doc).toBe true

describe 'Org.config', ->
  it 'should accept the headline TODO configuration', ->
    org = new Org { headlineTodos: ['WORK'] }
    headline = '* WORK [#C] Some work to do :work:'
    parser = org.parse.headline()
    result = parser(headline)
    expect(result.todo).toEqual('WORK')

  it 'should accept the headline PRIORITIES configuration', ->
    org = new Org { headlinePriorities: ['D'] }
    headline = '* TODO [#D] Some work to do :work:'
    parser = org.parse.headline()
    result = parser(headline)
    expect(result.priority).toEqual('D')
