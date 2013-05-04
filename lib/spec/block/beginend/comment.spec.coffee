require 'jasmine-matchers'
_ = require 'lodash'

Comment = require '../../../src/block/beginend/comment'
Section = require '../../../src/block/section'
Lines   = require '../../../src/block/lines'
Org     = require '../../../src/core'

describe 'Comment', ->
  it 'should work with a 2-line comment', ->
    txt = """
    #+BEGIN_COMMENT
    this is
    a comment
    #+END_COMMENT
    """
    sect = new Section new Org, null
    sect.consume(new Lines txt)
    expect(sect.content.children().length).toBe 1
    comment = sect.content.children()[0]
    expect(comment.type).toBe 'comment'
    expect(comment.content.length()).toBe 2
    lines = comment.content.asArray() 
    expect(lines[0]).toBe 'this is'
    expect(lines[1]).toBe 'a comment'
