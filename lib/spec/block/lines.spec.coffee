require 'jasmine-matchers'
_     = require 'lodash'
Lines = require '../../src/block/lines'

txt1 = """
This is a sample text.
With only two lines.
"""

txt2 = "  \n  \nThis is a sample text.\nWith initially two blank lines (second one has 2 spaces)."

describe 'Lines', ->
  it 'should have an arr Array property', ->
    l = new Lines txt1
    expect(l.array).toBeArray
    expect(l.arr.length).toBe 2

describe 'Lines.length', ->
  it 'should return the length or remaining lines', ->
    l = new Lines txt1
    expect(l.length()).toBe 2
    l.pop()
    expect(l.length()).toBe 1

describe 'Lines.popWhile', ->
  it 'should return an array', ->
    l = new Lines txt1
    popped = l.popWhile /.*/
    expect(popped).toBeArray
  it 'should return all lines if passed a function always returning true', ->
    l = new Lines txt1
    popped = l.popWhile ()->true
    expect(popped.length).toBe 2
    expect(l.length()).toBe 0
  it 'should return all lines if passed a regexp matching anything', ->
    l = new Lines txt1
    popped = l.popWhile /.*/g
    expect(popped.length).toBe 2
    expect(l.length()).toBe 0
  it 'should work with regexps', ->
    l = new Lines "a\na\na\nb"
    popped = l.popWhile /^a$/g
    expect(popped.length).toBe 3
    expect(l.length()).toBe 1

describe 'Lines.trimBlank', ->
  it 'should do nothing if nothing to be removed', ->
    l = new Lines txt1
    lengthBefore = l.length
    trimmed = l.trimBlank
    expect(trimmed.length).toBe 0

  it 'should remove all blank lines from the current array', ->
    l = new Lines txt2
    expect(l.length()).toBe 4
    trimmed = l.trimBlank()
    expect(trimmed.length).toBe 2
    expect(l.length()).toBe 2
    expect(l.pop()).toEqual 'This is a sample text.'
