require('jasmine-matchers')

_U = require('../src/utils.js')

describe 'Utils', ->
  it 'should be defined', ->
    expect(_U).toBeDefined()
    expect(_U).not.toBeNull()

describe 'Utils.id', ->
  it 'should return two different values on two different calls', ->
    expect(_U.id()).not.toBe(_U.id())
  it 'should return two values differing by 1', ->
    id1 = _U.id()
    id2 = _U.id()
    expect(id2-id1).toBe(1)

describe 'Utils.extendProto', ->
  Parent = {}
  Child = {}

  beforeEach ->
    Parent = ->
    Parent.prototype =
      name: -> 'parent'
    Child = ->
      Parent.call(this);

  it 'should add function to the prototype', ->
    _U.extendProto Child, Parent, 
      type: -> 'child'
    c = new Child
    expect(c.name()).toEqual('parent')
    expect(c.type()).toEqual('child')

  it 'should overload function of the parent prototype', ->
    _U.extendProto Child, Parent, 
      name: -> 'child'
    c = new Child
    expect(c.name()).toEqual('child')

  it 'should return the new prototype', ->
    actual = _U.extendProto Child, Parent, 
      name: -> 'child'
    expect(actual).toBe(Child.prototype)