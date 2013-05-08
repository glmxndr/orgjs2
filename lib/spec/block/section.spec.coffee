require 'jasmine-matchers'

Org     = require '../../src/core'
Block   = require '../../src/block'
Section = require '../../src/block/section'
Lines   = require '../../src/block/lines'

describe 'Section.match', ->
  it 'should return true for a line starting with a star', ->
    expect(Section.match(new Lines '* anything')).toEqual true
  it 'should return false for anything else', ->
    expect(Section.match(new Lines '\t* anyting')).toEqual false
    expect(Section.match(new Lines 'anything')).toEqual false
    expect(Section.match(new Lines '')).toEqual false

describe 'Section.consume', ->
  txt = """
  Introduction
  * Main title
  ** Sub1
     Some para
     continued TKN here

     Another para
  ** Sub2
  * Conclusion
    The end
  """
  doc = new Section()
  doc.org = new Org
  doc.consume(new Lines(txt))

  it 'should parse the correct structure', ->
    expect(doc.children().length).toBe 2
    main = doc.children()[0]
    conclusion = doc.children()[1]
    expect(main.children().length).toBe 2
    sub1 = main.children()[0]
    sub2 = main.children()[0]
    expect(sub1.children().length).toBe 0
    expect(sub2.children().length).toBe 0
    expect(conclusion.children().length).toBe 0
