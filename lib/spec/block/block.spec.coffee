require 'jasmine-matchers'
_ = require 'lodash'

Config = require '../../src/config'
Block = require '../../src/block/block'

describe 'Block', ->
  it 'should be defined', ->
    expect(Block).toBeDefined
    expect(Block).not.toBeNull

describe 'Block.levels', ->
  it 'should contain 5 levels', ->
    expect(Block.levels.length).toBe 5

describe 'Block.precedence', ->
  it 'should have one array per level', ->
    _.each Block.level, (lvl) ->
      expect(Block.precedence[lvl]).toBeArray

describe 'Block.register', ->

  lvl = Block.levels[0]
  tmp = Block.precedence.medium
  Block.precedence[lvl] = []

  it 'should work when called once', ->
    Block = require '../../src/block/block'
    arr = Block.precedence[lvl]
    Block.register 'test1', lvl
    expect(arr.length).toBe 1

  it 'should keep track of previously added things', ->
    Block = require '../../src/block/block'
    arr = Block.precedence[lvl]
    Block.register 'test2', lvl
    expect(arr.length).toBe 2

  Block.precedence[lvl] = []

