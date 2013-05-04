require 'jasmine-matchers'
_       = require 'lodash'
Section = require '../../../src/block/section'

Comment = require '../../../src/block/beginend/comment'

describe 'Comment', ->
  it 'should work with a 2-line comment', ->
    txt = """
    #+BEGIN_COMMENT
    this is
    a comment
    #+END_COMMENT
    """
    sect = Section.parse(txt)
    expect(sect.content.children().length).toBe 1
    comment = sect.content.children()[0]
    expect(comment.type).toBe 'comment'
    expect(comment.content.length()).toBe 2
    lines = comment.content.asArray() 
    expect(lines[0]).toBe 'this is'
    expect(lines[1]).toBe 'a comment'
